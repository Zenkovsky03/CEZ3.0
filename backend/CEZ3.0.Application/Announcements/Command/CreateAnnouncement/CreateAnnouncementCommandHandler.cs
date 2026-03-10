using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Announcements.Command.CreateAnnouncement;

public class CreateAnnouncementCommandHandler(ILogger<CreateAnnouncementCommandHandler> logger,
    IUserContext userContext,
    ICourseEnrollmentRepository courseEnrollmentRepository,
    IAnnouncementRepository announcementRepository
    ) : IRequestHandler<CreateAnnouncementCommand, string>
{
    private readonly ILogger<CreateAnnouncementCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;
    private readonly IAnnouncementRepository _announcementRepository = announcementRepository;

    public async Task<string> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating new announcement");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        if (currentUser.role == UserRoles.Student.ToString())
        {
            _logger.LogWarning("User {UserId} with role {Role} attempted to create announcement without permission.",
                currentUser.id, currentUser.role);

            throw new ForbiddenException("Current user cant create announcements.");
        }

        if (request.Title.Length > 100)
        {
            _logger.LogWarning("Announcement title exceeds maximum length. User: {UserId}, Title Length: {TitleLength}",
                currentUser.id, request.Title.Length);

            throw new BadRequestException("Announcement title cannot exceed 100 characters.");
        }

        if (request.Content.Length > 1000)
        {
            _logger.LogWarning("Announcement content exceeds maximum length. User: {UserId}, Content Length: {ContentLength}",
                currentUser.id, request.Content.Length);

            throw new BadRequestException("Announcement content cannot exceed 1000 characters.");
        }

        if (request.Recivers == null || request.Recivers.Count == 0)
        {
            _logger.LogWarning("Announcement creation failed due to missing recipients. User: {UserId}",
                currentUser.id);

            throw new BadRequestException("Announcement must have at least one recipient.");
        }

        var courseIds = request.Recivers
            .Where(id => ObjectId.TryParse(id, out _))
            .Select(ObjectId.Parse)
            .ToList();

        var reciversIds = await _courseEnrollmentRepository.GetEnrolStudentIdAsync(courseIds);

        if (reciversIds == null || reciversIds.Count == 0)
        {
            throw new BadRequestException("Announcement must have at least one recipient.");
        }

        var announcement = new Announcement
        {
            Title = request.Title,
            Content = request.Content,
            CreatedById = ObjectId.Parse(currentUser.id),
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var id = await _announcementRepository.CreateAnnouncementAsync(announcement);

        var recivers = reciversIds.Select(studentId => new UserAnnouncement
        {
            AnnouncementId = id,
            UserId = studentId,
            IsActive = true,
            CreatedAt = announcement.CreatedAt
        }).ToList();

        await _announcementRepository.AddAnnouncementReciversAsync(recivers);

        return id.ToString();
    }
}
