using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Events.Command.DeleteEvent;

public class DeleteEventCommandHandler(
    ILogger<DeleteEventCommandHandler> logger,
    IUserContext userContext,
    IEventRepository eventRepository) : IRequestHandler<DeleteEventCommand>
{
    public async Task Handle(DeleteEventCommand request, CancellationToken cancellationToken)
    {
        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

        if (currentUser.role == UserRoles.Student.ToString())
            throw new ForbiddenException("Students cannot delete events.");

        if (!ObjectId.TryParse(request.Id, out var eventId))
            throw new BadRequestException("Invalid event ID.");

        var ev = await eventRepository.GetByIdAsync(eventId)
            ?? throw new BadRequestException("Event not found.");

        ev.IsActive = false;
        await eventRepository.SaveChangesAsync();
    }

    private readonly ILogger<DeleteEventCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IEventRepository _eventRepository = eventRepository;
}
