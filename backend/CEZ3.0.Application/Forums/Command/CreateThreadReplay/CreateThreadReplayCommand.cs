using MediatR;

namespace CEZ3._0.Application.Forums.Command.CreateThreadReplay;

public class CreateThreadReplayCommand : IRequest<string>
{
    public string ThreadId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
