using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Command.SoftDeleteUser;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Command.SoftDeleteUser.Tests
{
    public class SoftDeleteUserCommandHandlerTests
    {
        private readonly Mock<ILogger<SoftDeleteUserCommandHandler>> _loggerMock = new();
        private readonly Mock<IUserContext> _userContextMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly SoftDeleteUserCommandHandler _handler;

        public SoftDeleteUserCommandHandlerTests()
        {
            _handler = new SoftDeleteUserCommandHandler(
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
                _handler.Handle(new SoftDeleteUserCommand { UserId = NewId() }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_InvalidUserIdFormat_ThrowsBadRequestException()
        {
            SetCurrentUser(NewId());

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new SoftDeleteUserCommand { UserId = "bad-format" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_CurrentUserNotAdmin_ThrowsForbiddenException()
        {
            SetCurrentUser(NewId(), UserRoles.Student.ToString());

            await Assert.ThrowsAsync<ForbiddenException>(() =>
                _handler.Handle(new SoftDeleteUserCommand { UserId = NewId() }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            SetCurrentUser(NewId());
            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new SoftDeleteUserCommand { UserId = NewId() }, CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_ValidRequest_SetsIsActiveFalseAndSavesChanges()
        {
            var adminId = NewId();
            var targetId = NewId();
            var targetUser = new User { Id = ObjectId.Parse(targetId), IsActive = true };

            SetCurrentUser(adminId);
            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(targetUser);

            await _handler.Handle(new SoftDeleteUserCommand { UserId = targetId }, CancellationToken.None);

            Assert.False(targetUser.IsActive);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}