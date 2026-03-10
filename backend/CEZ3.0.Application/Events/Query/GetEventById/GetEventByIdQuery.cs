using CEZ3._0.Application.Events.Dtos;
using MediatR;

namespace CEZ3._0.Application.Events.Query.GetEventById;

public class GetEventByIdQuery : IRequest<EventDto>
{
    public string EventId { get; set; } = string.Empty;

    public GetEventByIdQuery(string eventId)
    {
        EventId = eventId;
    }
}
