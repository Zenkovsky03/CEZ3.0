using MediatR;

namespace CEZ3._0.Application.Users.Command.UnblockUser;

public class UnblockUserCommand : IRequest
{
    public string UserId { get; set; } = default!;

    public UnblockUserCommand(string userId)
    {
        UserId = userId;
    }
}
