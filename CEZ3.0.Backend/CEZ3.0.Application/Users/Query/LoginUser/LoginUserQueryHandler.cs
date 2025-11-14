using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using Org.BouncyCastle.Crypto.Generators;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Query.LoginUser
{
    public class LoginUserQueryHandler(ILogger<LoginUserQueryHandler> logger,
        IUserRepository userRepository,
        ITokenService tokenService) : IRequestHandler<LoginUserQuery,string>
    {
        private readonly ILogger<LoginUserQueryHandler> _logger = logger;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ITokenService _tokenService = tokenService;

        public async Task<string> Handle(LoginUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetUserByLoginAsync(request.Login);
            if (user == null)
            {
                _logger.LogWarning("Login attempt failed: User with login {Login} not found.", request.Login);
                throw new BadRequestException("User not found");
            }

            string storedHashedString = user.PasswordHash;


            bool isPasswordValid;
            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, storedHashedString);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password verification for user {Login}. Hash format might be invalid.", request.Login);
                throw new BadRequestException("An error occurred during authentication.");
            }

            if (!isPasswordValid)
            {
                _logger.LogWarning("Login attempt failed for user {Login}: Invalid password.", request.Login);
                throw new BadRequestException("Invalid login or password");
            }

            var token = _tokenService.CreateToken(user);
            _logger.LogInformation("User with login {Login} logged in successfully.", request.Login);

            return token;
        }
    }
}
