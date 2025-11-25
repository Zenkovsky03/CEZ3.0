using MediatR;

namespace CEZ3._0.Application.Users.Command.BlockUser;

public class BlockUserCommand : IRequest
{
    public string UserId { get; set; } = default!;
}
