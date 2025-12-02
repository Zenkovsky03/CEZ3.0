using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Users.Command.ChangeUserRole;

public class ChangeUserRoleCommandHandler(
    IUserRepository userRepository,
    ILogger<ChangeUserRoleCommandHandler> logger) : IRequestHandler<ChangeUserRoleCommand>
{
    public async Task Handle(ChangeUserRoleCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Changing role for user with ID: {UserId} to {Role}", request.UserId, request.Role);

        if (!ObjectId.TryParse(request.UserId, out var userId))
        {
            throw new BadRequestException("Invalid UserId format.");
        }

        UserRoles roleEnum;
        if (!Enum.TryParse(request.Role, true, out roleEnum) || !Enum.IsDefined(typeof(UserRoles), roleEnum))
        {
            // 3. If not valid, throw an exception with a helpful message
            var allowedRoles = string.Join(", ", Enum.GetNames(typeof(UserRoles)));
            throw new BadRequestException($"Invalid role: '{request.Role}'. Allowed roles are: {allowedRoles}, Professor.");
        }

        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new BadRequestException("User not found.");
        }

        user.Role = roleEnum.ToString();

        await userRepository.SaveChangesAsync();
        logger.LogInformation("Role for user with ID: {UserId} changed to {Role}", userId, user.Role);
    }
}