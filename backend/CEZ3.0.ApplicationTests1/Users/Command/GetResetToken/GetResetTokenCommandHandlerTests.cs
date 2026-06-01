using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Command.GetResetToken;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Command.GetResetToken.Tests
{
    public class GetResetTokenCommandHandlerTests
    {
        private readonly Mock<ILogger<GetResetTokenCommandHandler>> _loggerMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly Mock<IEmailSender> _emailSenderMock = new();
        private readonly GetResetTokenCommandHandler _handler;

        public GetResetTokenCommandHandlerTests()
        {
            _handler = new GetResetTokenCommandHandler(
                _loggerMock.Object,
                _userRepositoryMock.Object,
                _emailSenderMock.Object);
        }

        // ------------------------------------------------------------------
        // Sad path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync("unknownuser"))
                .ReturnsAsync((User?)null);

            var command = new GetResetTokenCommand { Username = "unknownuser" };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_ValidUser_SetsResetTokenAndExpiry()
        {
            var user = new User
            {
                Username = "jkowalski",
                ResetToken = null,
                ResetTokenExpiry = null
            };

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync("jkowalski"))
                .ReturnsAsync(user);

            var before = DateTime.UtcNow;

            await _handler.Handle(new GetResetTokenCommand { Username = "jkowalski" }, CancellationToken.None);

            Assert.NotNull(user.ResetToken);
            Assert.True(Guid.TryParse(user.ResetToken, out _), "ResetToken should be a valid GUID.");
            Assert.NotNull(user.ResetTokenExpiry);
            Assert.True(user.ResetTokenExpiry > before.AddMinutes(59), "Expiry should be ~1 hour from now.");
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Handle_CalledTwice_OverwritesPreviousToken()
        {
            var user = new User { Username = "jkowalski" };

            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync("jkowalski"))
                .ReturnsAsync(user);

            var command = new GetResetTokenCommand { Username = "jkowalski" };

            await _handler.Handle(command, CancellationToken.None);
            var firstToken = user.ResetToken;

            await _handler.Handle(command, CancellationToken.None);
            var secondToken = user.ResetToken;

            Assert.NotEqual(firstToken, secondToken);
        }
    }
}