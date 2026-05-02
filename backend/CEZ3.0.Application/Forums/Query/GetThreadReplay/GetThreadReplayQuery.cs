using CEZ3._0.Application.Forums.Dtos;
using MediatR;

namespace CEZ3._0.Application.Forums.Query.GetThreadReplay;

public class GetThreadReplayQuery : IRequest<ThreadReplayDto>
{
    public string ThreadId { get; set; }

    public GetThreadReplayQuery(string threadId)
    {
        ThreadId = threadId;
    }
}
