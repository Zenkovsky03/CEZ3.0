using MediatR;

namespace CEZ3._0.Application.Forums.Command.DeleteThreadReplay;

public class DeleteThreadReplayCommand : IRequest
{
    public string ThreadReplayId { get; set; }

    public DeleteThreadReplayCommand(string threadReplayId)
    {
        ThreadReplayId = threadReplayId;
    }
}
