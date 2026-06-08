using MediatR;

namespace CEZ3._0.Application.Events.Command.UpdateEvent;

public class UpdateEventCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
