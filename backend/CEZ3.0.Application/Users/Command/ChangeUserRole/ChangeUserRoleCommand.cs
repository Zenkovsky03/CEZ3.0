using MediatR;

namespace CEZ3._0.Application.Users.Command.ChangeUserRole;

public class ChangeUserRoleCommand : IRequest
{
    public string UserId { get; set; } = default!;
    public string Role { get; set; } = default!;
}