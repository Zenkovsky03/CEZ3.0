using MediatR;

namespace CEZ3._0.Application.Users.Command.ResetPassword;

public class ResetPasswordCommand : IRequest
{
    public string UserName { get; set; } = string.Empty;
    public string ResetToken { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
