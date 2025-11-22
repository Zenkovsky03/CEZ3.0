using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Users.Command.ResetPassword;

public class ResetPasswordCommandHandler(ILogger<ResetPasswordCommandHandler> logger,
    IUserRepository userRepository) : IRequestHandler<ResetPasswordCommand>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ILogger<ResetPasswordCommandHandler> _logger = logger;

    public async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling ResetPasswordCommand for user: {UserName}", request.UserName);

        var user = await _userRepository.GetUserByLoginAsync(request.UserName);

        if (user == null)
            throw new BadRequestException("User not found");

        if (user.ResetToken == null || user.ResetToken != request.ResetToken || user.ResetTokenExpiry < DateTime.UtcNow)
        {
            user.ResetToken = null;
            user.ResetTokenExpiry = null;
            await _userRepository.SaveChangesAsync();
            throw new BadRequestException("Invalid or expired reset token");
        }

        user.PasswordHash = HashPassword(request.NewPassword);
        user.ResetToken = null;
        user.ResetTokenExpiry = null;

        await _userRepository.SaveChangesAsync();
    }

    private string HashPassword(string password)
    {
        string hashedPasswordString = BCrypt.Net.BCrypt.HashPassword(password);
        return hashedPasswordString;
    }
}
