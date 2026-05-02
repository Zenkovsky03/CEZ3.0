using MediatR;

namespace CEZ3._0.Application.Forums.Command.DeleteThread;

public class DeleteThreadCommand : IRequest
{
    public string ThreadId { get; set; }

    public DeleteThreadCommand(string threadId)
    {
        ThreadId = threadId;
    }
}
