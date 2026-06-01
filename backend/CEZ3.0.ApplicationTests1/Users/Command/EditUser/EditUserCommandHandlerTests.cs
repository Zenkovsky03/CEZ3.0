using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Command.EditUser;
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

namespace CEZ3._0.Application.Users.Command.EditUser.Tests
{
    public class EditUserCommandHandlerTests
    {
        private readonly Mock<ILogger<EditUserCommandHandler>> _loggerMock = new();
        private readonly Mock<IUserContext> _userContextMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly EditUserCommandHandler _handler;

        public EditUserCommandHandlerTests()
        {
            _handler = new EditUserCommandHandler(
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
                _handler.Handle(new EditUserCommand { UserId = NewId() }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_InvalidUserIdFormat_ThrowsBadRequestException()
        {
            SetCurrentUser(NewId());

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new EditUserCommand { UserId = "bad-id", Email = "a@b.com" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_NotAdminEditingAnotherUser_ThrowsForbiddenException()
        {
            var currentUserId = NewId();
            var otherUserId = NewId();
            SetCurrentUser(currentUserId, UserRoles.Student.ToString());

            await Assert.ThrowsAsync<ForbiddenException>(() =>
                _handler.Handle(new EditUserCommand { UserId = otherUserId, Email = "a@b.com" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            var adminId = NewId();
            var targetId = NewId();
            SetCurrentUser(adminId);

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync((User?)null);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new EditUserCommand { UserId = targetId, Email = "new@test.com" }, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_EmailTakenByAnotherUser_ThrowsBadRequestException()
        {
            var adminId = NewId();
            var targetId = NewId();
            var targetObjectId = ObjectId.Parse(targetId);

            SetCurrentUser(adminId);

            var existingUser = new User { Id = targetObjectId, Email = "old@test.com" };
            var conflictUser = new User { Id = ObjectId.GenerateNewId(), Email = "taken@test.com" };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(existingUser);
            _userRepositoryMock.Setup(x => x.GetUserByEmailAsync("taken@test.com"))
                .ReturnsAsync(conflictUser);

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(new EditUserCommand { UserId = targetId, Email = "taken@test.com" }, CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_AdminEditsAnotherUser_UpdatesFieldsAndSaves()
        {
            var adminId = NewId();
            var targetId = NewId();
            var targetObjectId = ObjectId.Parse(targetId);

            SetCurrentUser(adminId);

            var existingUser = new User
            {
                Id = targetObjectId,
                FirstName = "Old",
                LastName = "Name",
                Email = "old@test.com"
            };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(existingUser);
            _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            var command = new EditUserCommand
            {
                UserId = targetId,
                FirstName = "New",
                LastName = "User",
                Email = "new@test.com"
            };

            await _handler.Handle(command, CancellationToken.None);

            Assert.Equal("New", existingUser.FirstName);
            Assert.Equal("User", existingUser.LastName);
            Assert.Equal("new@test.com", existingUser.Email);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Handle_UserEditsOwnProfile_UpdatesFieldsAndSaves()
        {
            var userId = NewId();
            var userObjectId = ObjectId.Parse(userId);

            SetCurrentUser(userId, UserRoles.Student.ToString());

            var existingUser = new User { Id = userObjectId, Email = "old@test.com" };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(existingUser);
            _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            var command = new EditUserCommand
            {
                UserId = userId,
                Email = "mine@test.com"
            };

            await _handler.Handle(command, CancellationToken.None);

            Assert.Equal("mine@test.com", existingUser.Email);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Handle_NullFirstNameAndLastName_DoesNotOverwriteExistingValues()
        {
            var adminId = NewId();
            var targetId = NewId();

            SetCurrentUser(adminId);

            var existingUser = new User
            {
                Id = ObjectId.Parse(targetId),
                FirstName = "Original",
                LastName = "Name",
                Email = "old@test.com"
            };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(existingUser);
            _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            var command = new EditUserCommand
            {
                UserId = targetId,
                FirstName = null,
                LastName = null,
                Email = "new@test.com"
            };

            await _handler.Handle(command, CancellationToken.None);

            Assert.Equal("Original", existingUser.FirstName);
            Assert.Equal("Name", existingUser.LastName);
        }
    }

}