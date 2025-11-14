using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Command.CreateUser
{
    public class CreateUserCommandHandler(IUserRepository userRepository, 
        ILogger<CreateUserCommandHandler> logger): IRequestHandler<CreateUserCommand>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ILogger<CreateUserCommandHandler> _logger = logger;

        public async Task Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByLoginAsync(request.Username);
            if (user != null)
            {
                throw new BadRequestException($"User with username '{request.Username}' already exists.");
            }

            var userEmail = await _userRepository.GetUserByEmailAsync(request.Email); 
            if (userEmail != null)
            {
                throw new BadRequestException($"User with email '{request.Email}' already exists.");
            }

            var passwordHash = HashPassword(request.Password);

            var newUser = new CEZ3._0.Domain.Entities.User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = "student", 
                IsActive = true,   
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddUserAsync(newUser); 

            _logger.LogInformation("New user created with username: {Username}", newUser.Username);
        }

        private string HashPassword(string password)
        {
            string hashedPasswordString = BCrypt.Net.BCrypt.HashPassword(password);
            return hashedPasswordString;
        }
    }
}
