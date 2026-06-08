using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Announcements.Command.DeleteAnnouncement;

public class DeleteAnnouncementCommandHandler(
    ILogger<DeleteAnnouncementCommandHandler> logger,
    IUserContext userContext,
    IAnnouncementRepository announcementRepository) : IRequestHandler<DeleteAnnouncementCommand>
{
    public async Task Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
    {
        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

        if (currentUser.role == UserRoles.Student.ToString())
            throw new ForbiddenException("Students cannot delete announcements.");

        if (!ObjectId.TryParse(request.Id, out var announcementId))
            throw new BadRequestException("Invalid announcement ID.");

        var announcement = await _announcementRepository.GetById(announcementId)
            ?? throw new BadRequestException("Announcement not found.");

        await _announcementRepository.DeleteAsync(announcement);
    }

    private readonly ILogger<DeleteAnnouncementCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IAnnouncementRepository _announcementRepository = announcementRepository;
}
