using CEZ3._0.Application.Forums.Dtos;
using MediatR;

namespace CEZ3._0.Application.Forums.Query.GetFullThead;

public class GetFullTheadQuery : IRequest<ThreadDto>
{
    public string ThreadId { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 5;

    public GetFullTheadQuery(string threadId, int pageNumber, int pageSize)
    {
        ThreadId = threadId;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}
