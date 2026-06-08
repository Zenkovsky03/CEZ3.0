using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Events.Command.UpdateEvent;

public class UpdateEventCommandHandler(
    ILogger<UpdateEventCommandHandler> logger,
    IUserContext userContext,
    IEventRepository eventRepository) : IRequestHandler<UpdateEventCommand>
{
    public async Task Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

        if (currentUser.role == UserRoles.Student.ToString())
            throw new ForbiddenException("Students cannot update events.");

        if (!ObjectId.TryParse(request.Id, out var eventId))
            throw new BadRequestException("Invalid event ID.");

        var ev = await eventRepository.GetByIdAsync(eventId)
            ?? throw new BadRequestException("Event not found.");

        if (request.Title.Length > 100)
            throw new BadRequestException("Event title cannot exceed 100 characters.");

        if (request.Description?.Length > 1000)
            throw new BadRequestException("Event description cannot exceed 1000 characters.");

        if (request.EndTime <= request.StartTime)
            throw new BadRequestException("End time must be after start time.");

        ev.Title = request.Title;
        ev.Description = request.Description ?? "";
        ev.StartTime = request.StartTime;
        ev.EndTime = request.EndTime;

        await eventRepository.SaveChangesAsync();
    }

    private readonly ILogger<UpdateEventCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IEventRepository _eventRepository = eventRepository;
}
