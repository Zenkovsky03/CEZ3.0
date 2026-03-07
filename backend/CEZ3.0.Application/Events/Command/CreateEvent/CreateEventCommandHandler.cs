using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Events.Command.CreateEvent;

public class CreateEventCommandHandler(ILogger<CreateEventCommandHandler> logger,
    IUserContext userContext,
    ICourseEnrollmentRepository courseEnrollmentRepository,
    IEventRepository eventRepository) : IRequestHandler<CreateEventCommand, string>
{
    private readonly ILogger<CreateEventCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;
    private readonly IEventRepository _eventRepository = eventRepository;

    public async Task<string> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CreateEventCommand for user");

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

        if (request.Description.Length > 1000)
        {
            _logger.LogWarning("Announcement content exceeds maximum length. User: {UserId}, Content Length: {ContentLength}",
                currentUser.id, request.Description.Length);

            throw new BadRequestException("Announcement content cannot exceed 1000 characters.");
        }

        if (request.Recivers == null || request.Recivers.Count == 0)
        {
            _logger.LogWarning("Announcement creation failed due to missing recipients.");

            throw new BadRequestException("Announcement must have at least one recipient.");
        }

        if (request.StartTime < DateTime.UtcNow)
        {
            _logger.LogWarning("Announcement creation failed due to invalid start time. StartTime: {StartTime}",
                request.StartTime);

            throw new BadRequestException("Announcement start time cannot be in the past.");
        }

        if (request.EndTime < request.StartTime)
        {
            _logger.LogWarning("Announcement creation failed due to invalid end time. StartTime: {StartTime}, EndTime: {EndTime}",
                request.StartTime, request.EndTime);

            throw new BadRequestException("Announcement end time cannot be before start time.");
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

        var eventObject = new Event
        {
            Title = request.Title,
            Description = request.Description,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            CreatedAt = DateTime.UtcNow,
            CreatedById = ObjectId.Parse(currentUser.id),
            IsActive = true
        };

        var eventId = await _eventRepository.AddEventAsync(eventObject);

        var recivers = reciversIds.Select(studentId => new UserEvent
        {
            EventId = eventId,
            UserId = studentId,
            IsActive = true,
            CreatedAt = eventObject.CreatedAt
        }).ToList();

        await _eventRepository.AddEventReciversAsync(recivers);

        return eventId.ToString();
    }
}
