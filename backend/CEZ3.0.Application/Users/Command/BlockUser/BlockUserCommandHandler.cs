using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Users.Command.BlockUser;

public class BlockUserCommandHandler(ILogger<BlockUserCommandHandler> logger,
    IUserContext userContext,
    IUserRepository userRepository) : IRequestHandler<BlockUserCommand>
{
    private readonly ILogger<BlockUserCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task Handle(BlockUserCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling BlockUserCommand for UserId: {UserId}", request.UserId);

        var user = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to block another user.");

        if (user == null)
        {
            _logger.LogWarning("No current user found in context.");
            throw new UnauthorizedException("User must be logged in to block another user.");
        }

        if (user.role != UserRoles.Admin.ToString())
        {
            _logger.LogWarning("User {UserId} with role {UserRole} attempted to block a user without sufficient permissions.", user.id, user.role);
            throw new ForbiddenException("Only admins can block users.");
        }

        if (user.id == request.UserId)
        {
            _logger.LogWarning("User {UserId} attempted to block themselves.", user.id);
            throw new BadRequestException("Users cannot block themselves.");
        }

        ObjectId id = ObjectId.Empty;

        if (!ObjectId.TryParse(request.UserId, out id))
        {
            _logger.LogWarning("Invalid UserId format: {UserId}", request.UserId);
            throw new BadRequestException("Invalid UserId format.");
        }

        var userToBlock = await _userRepository.GetByIdAsync(id);
        if (userToBlock == null)
        {
            _logger.LogWarning("User with Id {UserId} not found.", request.UserId);
            throw new BadRequestException("User not found.");
        }

        userToBlock.IsBlocked = true;
        await _userRepository.SaveChangesAsync();
    }
}
