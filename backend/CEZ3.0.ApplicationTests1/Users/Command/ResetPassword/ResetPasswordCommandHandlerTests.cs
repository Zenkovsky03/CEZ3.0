using CEZ3._0.Application.Users.Command.ResetPassword;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Command.ResetPassword.Tests
{
    public class ResetPasswordCommandHandlerTests
    {
        private readonly Mock<ILogger<ResetPasswordCommandHandler>> _loggerMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly ResetPasswordCommandHandler _handler;

        public ResetPasswordCommandHandlerTests()
        {
            _handler = new ResetPasswordCommandHandler(
                _loggerMock.Object,
                _userRepositoryMock.Object);
        }

        private static ResetPasswordCommand ValidCommand(User user) => new()
        {
            UserName = user.Username,
            ResetToken = user.ResetToken!,
            NewPassword = "NewSecurePass1!"
        };

        private static User UserWithValidToken() => new()
        {
            Username = "jkowalski",
            ResetToken = Guid.NewGuid().ToString(),
            ResetTokenExpiry = DateTime.UtcNow.AddHours(1),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPass1!")
        };

        // ------------------------------------------------------------------
        // Sad paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new ResetPasswordCommand { UserName = "ghost" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_ResetTokenIsNull_ThrowsBadRequestException()
        {
            var user = new User
            {
                Username = "jkowalski",
                ResetToken = null,
                ResetTokenExpiry = DateTime.UtcNow.AddHours(1)
            };

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync("jkowalski"))
                .ReturnsAsync(user);

            var command = new ResetPasswordCommand
            {
                UserName = "jkowalski",
                ResetToken = Guid.NewGuid().ToString(),
                NewPassword = "NewPass1!"
            };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_TokenDoesNotMatch_ThrowsBadRequestException()
        {
            var user = UserWithValidToken();

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);

            var command = new ResetPasswordCommand
            {
                UserName = user.Username,
                ResetToken = Guid.NewGuid().ToString(), // different token
                NewPassword = "NewPass1!"
            };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));

            // Token and expiry should be cleared after failed attempt
            Assert.Null(user.ResetToken);
            Assert.Null(user.ResetTokenExpiry);
        }

        [Fact]
        public async Task Handle_TokenExpired_ThrowsBadRequestException()
        {
            var token = Guid.NewGuid().ToString();
            var user = new User
            {
                Username = "jkowalski",
                ResetToken = token,
                ResetTokenExpiry = DateTime.UtcNow.AddHours(-1) // expired
            };

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);

            var command = new ResetPasswordCommand
            {
                UserName = user.Username,
                ResetToken = token,
                NewPassword = "NewPass1!"
            };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_ValidToken_UpdatesPasswordHashAndClearsToken()
        {
            var user = UserWithValidToken();
            var oldHash = user.PasswordHash;

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(user.Username))
                .ReturnsAsync(user);

            var command = ValidCommand(user);

            await _handler.Handle(command, CancellationToken.None);

            Assert.NotEqual(oldHash, user.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify(command.NewPassword, user.PasswordHash));
            Assert.Null(user.ResetToken);
            Assert.Null(user.ResetTokenExpiry);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}