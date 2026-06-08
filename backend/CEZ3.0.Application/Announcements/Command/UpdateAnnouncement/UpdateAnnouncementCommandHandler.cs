using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Announcements.Command.UpdateAnnouncement;

public class UpdateAnnouncementCommandHandler(
    ILogger<UpdateAnnouncementCommandHandler> logger,
    IUserContext userContext,
    IAnnouncementRepository announcementRepository) : IRequestHandler<UpdateAnnouncementCommand>
{
    public async Task Handle(UpdateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

        if (currentUser.role == UserRoles.Student.ToString())
            throw new ForbiddenException("Students cannot update announcements.");

        if (!ObjectId.TryParse(request.Id, out var announcementId))
            throw new BadRequestException("Invalid announcement ID.");

        var announcement = await _announcementRepository.GetById(announcementId)
            ?? throw new BadRequestException("Announcement not found.");

        if (request.Title.Length > 100)
            throw new BadRequestException("Announcement title cannot exceed 100 characters.");

        if (request.Content.Length > 1000)
            throw new BadRequestException("Announcement content cannot exceed 1000 characters.");

        announcement.Title = request.Title;
        announcement.Content = request.Content;

        await _announcementRepository.UpdateAsync(announcement);
    }

    private readonly ILogger<UpdateAnnouncementCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IAnnouncementRepository _announcementRepository = announcementRepository;
}
