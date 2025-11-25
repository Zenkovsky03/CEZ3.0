using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Users.Command.UnblockUser;

public class UnblockUserCommandHandler(ILogger<UnblockUserCommandHandler> logger,
    IUserContext userContext,
    IUserRepository userRepository) : IRequestHandler<UnblockUserCommand>
{
    private readonly ILogger<UnblockUserCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task Handle(UnblockUserCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling UnblockUserCommand for UserId: {UserId}", request.UserId);

        var user = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to unblock another user.");

        if (user == null)
        {
            _logger.LogWarning("No current user found in context.");
            throw new UnauthorizedException("User must be logged in to unblock another user.");
        }

        if (user.role != UserRoles.Admin.ToString())
        {
            _logger.LogWarning("User {UserId} with role {UserRole} attempted to unblock a user without sufficient permissions.", user.id, user.role);
            throw new ForbiddenException("Only admins can unblock users.");
        }

        if (user.id == request.UserId)
        {
            _logger.LogWarning("User {UserId} attempted to unblock themselves.", user.id);
            throw new BadRequestException("Users cannot unblock themselves.");
        }

        ObjectId id = ObjectId.Empty;

        if (!ObjectId.TryParse(request.UserId, out id))
        {
            _logger.LogWarning("Invalid UserId format: {UserId}", request.UserId);
            throw new BadRequestException("Invalid UserId format.");
        }

        var userToUnblock = await _userRepository.GetByIdAsync(id);
        if (userToUnblock == null)
        {
            _logger.LogWarning("User with Id {UserId} not found.", request.UserId);
            throw new BadRequestException("User not found.");
        }

        userToUnblock.IsBlocked = false;
        await _userRepository.SaveChangesAsync();
    }
}
