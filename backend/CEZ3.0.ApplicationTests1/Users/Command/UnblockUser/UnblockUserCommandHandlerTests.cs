using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Command.UnblockUser;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Assert = Xunit.Assert;
using Xunit;

namespace CEZ3._0.Application.Users.Command.UnblockUser.Tests
{
    public class UnblockUserCommandHandlerTests
    {
        private readonly Mock<ILogger<UnblockUserCommandHandler>> _loggerMock = new();
        private readonly Mock<IUserContext> _userContextMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly UnblockUserCommandHandler _handler;

        public UnblockUserCommandHandlerTests()
        {
            _handler = new UnblockUserCommandHandler(
                _loggerMock.Object,
                _userContextMock.Object,
                _userRepositoryMock.Object);
        }

        private static string NewId() => ObjectId.GenerateNewId().ToString();

        private void SetCurrentUser(string id, string role = "Admin") =>
            _userContextMock.Setup(x => x.GetCurrentUser())
                .Returns(new CurrentUser(id, "admin@test.com", role));

        // ------------------------------------------------------------------
        // Sad paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
        {
            _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

            await Assert.ThrowsAsync<UnauthorizedException>(() =>
                _handler.Handle(new UnblockUserCommand(NewId()), CancellationToken.None));
        }

        [Fact]
        public async Task Handle_CurrentUserNotAdmin_ThrowsForbiddenException()
        {
            SetCurrentUser(NewId(), UserRoles.Student.ToString());

            await Assert.ThrowsAsync<ForbiddenException>(() =>
                _handler.Handle(new UnblockUserCommand(NewId()), CancellationToken.None));
        }

        [Fact]
        public async Task Handle_AdminUnblockingSelf_ThrowsBadRequestException()
        {
            var adminId = NewId();
            SetCurrentUser(adminId);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new UnblockUserCommand(adminId), CancellationToken.None));
        }

        [Fact]
        public async Task Handle_InvalidUserIdFormat_ThrowsBadRequestException()
        {
            SetCurrentUser(NewId());

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new UnblockUserCommand("not-valid-objectid"), CancellationToken.None));
        }

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            SetCurrentUser(NewId());
            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new UnblockUserCommand(NewId()), CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_ValidRequest_SetsIsBlockedFalseAndSavesChanges()
        {
            var adminId = NewId();
            var targetId = NewId();
            var targetUser = new User { Id = ObjectId.Parse(targetId), IsBlocked = true };

            SetCurrentUser(adminId);
            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(targetUser);

            await _handler.Handle(new UnblockUserCommand(targetId), CancellationToken.None);

            Assert.False(targetUser.IsBlocked);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}