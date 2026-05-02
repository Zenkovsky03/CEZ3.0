using CEZ3._0.Application.Forums.Dtos;
using MediatR;

namespace CEZ3._0.Application.Forums.Query.GetThreadsHeader;

public class GetThreadsHeaderQuery : IRequest<List<ThreadDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public GetThreadsHeaderQuery(int pageNumber, int pageSize)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}
