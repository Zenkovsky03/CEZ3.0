using CEZ3._0.Application.Users.Dtos;
using MediatR;

namespace CEZ3._0.Application.Users.Query.GetUsersByRoleList;

public class GetUsersByRoleListQuery : IRequest<List<UserDto>>
{
    public string Role { get; set; } = string.Empty;

    public GetUsersByRoleListQuery(string role)
    {
        Role = role;
    }
}
