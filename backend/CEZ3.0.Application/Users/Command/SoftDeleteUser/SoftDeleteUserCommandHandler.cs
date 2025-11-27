using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Command.SoftDeleteUser
{
    public class SoftDeleteUserCommandHandler(ILogger<SoftDeleteUserCommandHandler> logger,
        IUserContext userContext,
        IUserRepository userRepository) : IRequestHandler<SoftDeleteUserCommand>
    {
        private readonly ILogger<SoftDeleteUserCommandHandler> _logger = logger;
        private readonly IUserContext _userContext = userContext;
        private readonly IUserRepository _userRepository = userRepository;

        public async Task Handle(SoftDeleteUserCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in to delete a user.");

            if (!ObjectId.TryParse(request.UserId, out var userId))
            {
                _logger.LogWarning("Invalid UserId format: {UserId}", request.UserId);
                throw new BadRequestException("Invalid UserId format.");
            }

            if (currentUser.role != UserRoles.Admin.ToString())
            {
                _logger.LogWarning("User with ID: {CurrentUserId} attempted to edit user with ID: {UserId} without permission.",
                    currentUser.id, userId);
                throw new ForbiddenException("You do not have permission to edit this user's profile.");
            }

            var userToDelete = await _userRepository.GetByIdAsync(userId);
            if (userToDelete == null)
            {
                _logger.LogWarning("User with ID: {UserId} not found.", userId);
                throw new BadRequestException("User not found.");
            }

            userToDelete.IsActive = false;
            await _userRepository.SaveChangesAsync();

            _logger.LogInformation("User {UserId} soft deleted by {CurrentUserId}", request.UserId, currentUser.id);
        }
    }
}
