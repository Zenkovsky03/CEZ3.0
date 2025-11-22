using MediatR;

namespace CEZ3._0.Application.Users.Command.GetResetToken;

public class GetResetTokenCommand : IRequest
{
    public string Username { get; set; } = string.Empty;
}
