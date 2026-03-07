using CEZ3._0.Application.Events.Dtos;
using CEZ3._0.Application.Helpers;
using MediatR;

namespace CEZ3._0.Application.Events.Query.GetEventsForUser;

public class GetEventsForUserQuery : IRequest<PagedResult<EventDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 5;

    public GetEventsForUserQuery(int pageNumber, int pageSize)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}
