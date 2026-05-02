using MediatR;

namespace CEZ3._0.Application.Forums.Command.CloseThread;

public class CloseThreadCommand : IRequest
{
    public string ThreadId { get; set; }

    public CloseThreadCommand(string threadId)
    {
        ThreadId = threadId;
    }
}
