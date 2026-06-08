using MediatR;

namespace CEZ3._0.Application.Events.Command.DeleteEvent;

public class DeleteEventCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}
