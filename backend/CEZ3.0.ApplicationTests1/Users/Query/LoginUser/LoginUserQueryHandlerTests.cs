using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Query.LoginUser;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Query.LoginUser.Tests
{
    public class LoginUserQueryHandlerTests
    {
        private readonly Mock<ILogger<LoginUserQueryHandler>> _loggerMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly Mock<ITokenService> _tokenServiceMock = new();
        private readonly LoginUserQueryHandler _handler;

        private const string PlainPassword = "SecurePass1!";
        private static readonly string HashedPassword = BCrypt.Net.BCrypt.HashPassword(PlainPassword);

        public LoginUserQueryHandlerTests()
        {
            _handler = new LoginUserQueryHandler(
                _loggerMock.Object,
                _userRepositoryMock.Object,
                _tokenServiceMock.Object);
        }

        private User ActiveUserWithCorrectPassword() => new()
        {
            Username = "jkowalski",
            Email = "jan@test.com",
            PasswordHash = HashedPassword,
            IsActive = true
        };

        // ------------------------------------------------------------------
        // Sad paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync("ghost"))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new LoginUserQuery { Login = "ghost", Password = "any" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_UserIsInactive_ThrowsBadRequestException()
        {
            var user = ActiveUserWithCorrectPassword();
            user.IsActive = false;

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new LoginUserQuery { Login = user.Username, Password = PlainPassword }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_WrongPassword_ThrowsBadRequestException()
        {
            var user = ActiveUserWithCorrectPassword();

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new LoginUserQuery { Login = user.Username, Password = "WrongPassword!" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_CorruptedHash_ThrowsBadRequestException()
        {
            var user = ActiveUserWithCorrectPassword();
            user.PasswordHash = "this-is-not-a-bcrypt-hash";

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new LoginUserQuery { Login = user.Username, Password = PlainPassword }, CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_ValidCredentials_ReturnsToken()
        {
            var user = ActiveUserWithCorrectPassword();
            const string expectedToken = "jwt.token.here";

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);
            _tokenServiceMock.Setup(x => x.CreateToken(user))
                .Returns(expectedToken);

            var result = await _handler.Handle(
                new LoginUserQuery { Login = user.Username, Password = PlainPassword },
                CancellationToken.None);

            Assert.Equal(expectedToken, result);
            _tokenServiceMock.Verify(x => x.CreateToken(user), Times.Once);
        }
    }
}