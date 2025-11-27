using CEZ3._0.Application.Interfaces;
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

namespace CEZ3._0.Application.Users.Command.EditUser
{
    public class EditUserCommandHandler(ILogger<EditUserCommandHandler> logger,
        IUserContext userContext,
        IUserRepository userRepository) : IRequestHandler<EditUserCommand>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger<EditUserCommandHandler> _logger = logger;
        private readonly IUserContext _userContext = userContext;

        public async Task Handle(EditUserCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Editing user with ID: {UserId}", request.UserId);
            var currentUser = _userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in to edit profile.");

            if (!ObjectId.TryParse(request.UserId, out var userId))
            {
                _logger.LogWarning("Invalid UserId format: {UserId}", request.UserId);
                throw new BadRequestException("Invalid UserId format.");
            }

            if (currentUser.id != request.UserId && currentUser.role != "Admin")
            {
                _logger.LogWarning("User with ID: {CurrentUserId} attempted to edit user with ID: {UserId} without permission.",
                    currentUser.id, userId);
                throw new ForbiddenException("You do not have permission to edit this user's profile.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User with ID: {UserId} not found.", userId);
                throw new BadRequestException("User not found.");
            }

            var userWithSameEmail = await _userRepository.GetUserByEmailAsync(request.Email);
            if (userWithSameEmail != null && userWithSameEmail.Id != user.Id)
            {
                _logger.LogWarning("Email conflict: Another user with email {Email} already exists.", request.Email);
                throw new BadRequestException($"Another user with email '{request.Email}' already exists.");
            }


            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;

            await _userRepository.SaveChangesAsync();
            _logger.LogInformation("User with ID: {UserId} has been updated.", userId);
        }
    }
}