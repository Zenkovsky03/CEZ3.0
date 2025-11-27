using CEZ3._0.Application.Helpers;
using CEZ3._0.Application.Users.Dtos;
using MediatR;

namespace CEZ3._0.Application.Users.Query.GetUsersList;

public class GetUsersListQuery : IRequest<PagedResult<UserDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
