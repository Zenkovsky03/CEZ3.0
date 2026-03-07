using CEZ3._0.Application.Events.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Events.Query.GetEventById;

public class GetEventByIdQueryHandler(ILogger<GetEventByIdQueryHandler> logger,
    IEventRepository eventRepository,
    IUserRepository userRepository) : IRequestHandler<GetEventByIdQuery, EventDto>
{
    private readonly ILogger<GetEventByIdQueryHandler> _logger = logger;
    private readonly IEventRepository _eventRepository = eventRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<EventDto> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetEventByIdQuery");

        var id = ObjectId.Parse(request.EventId);

        if (id == ObjectId.Empty)
        {
            _logger.LogWarning("Invalid AnnouncementId: {AnnouncementId}", request.EventId);
            throw new BadRequestException("Invalid AnnouncementId");
        }

        var eventEntity = await _eventRepository.GetByIdAsync(id);

        if (eventEntity == null)
        {
            _logger.LogWarning("Announcement not found for AnnouncementId: {AnnouncementId}", request.EventId);

            throw new BadRequestException("Announcement not found");
        }

        var creator = await _userRepository.GetByIdAsync(eventEntity.CreatedById);

        if (creator == null)
        {
            _logger.LogWarning("Creator not found for AnnouncementId: {AnnouncementId}, CreatedById: {CreatedById}", request.EventId, eventEntity.CreatedById);
            throw new BadRequestException("Creator not found");
        }

        var dto = new EventDto
        {
            Id = eventEntity.Id.ToString(),
            Title = eventEntity.Title,
            Description = eventEntity.Description,
            StartTime = eventEntity.StartTime,
            EndTime = eventEntity.EndTime,
            CreatedAt = eventEntity.CreatedAt,
            CreatorEmail = creator.Email,
            CreatorFirstName = creator.FirstName,
            CreatorLastName = creator.LastName,
            CreatorId = creator.Id.ToString()
        };

        return dto;
    }
}
