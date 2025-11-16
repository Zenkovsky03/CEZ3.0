using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Users.Command.GetResetToken;

public class GetResetTokenCommandHandler(ILogger<GetResetTokenCommandHandler> logger,
    IUserRepository userRepository,
    IEmailSender emailSender) : IRequestHandler<GetResetTokenCommand>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ILogger<GetResetTokenCommandHandler> _logger = logger;
    private readonly IEmailSender _emailSender = emailSender;

    public async Task Handle(GetResetTokenCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetResetTokenCommand for user: {Username}", request.Username);

        var user = await _userRepository.GetUserByLoginAsync(request.Username);

        if (user == null)
            throw new BadRequestException("User not found");

        Guid resetToken = Guid.NewGuid();

        user.ResetToken = resetToken.ToString();
        user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

        await _userRepository.SaveChangesAsync();

        //Test output to console
        Console.WriteLine(resetToken.ToString());

        //send by email
        //await _emailSender.SendEmailAsync(user.Email, "Password Reset Token", $"Your password reset token is: {resetToken}");
    }

}
