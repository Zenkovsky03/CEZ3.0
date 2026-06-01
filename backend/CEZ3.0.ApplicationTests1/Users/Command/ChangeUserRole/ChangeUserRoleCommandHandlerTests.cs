using CEZ3._0.Application.Users.Command.ChangeUserRole;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Assert = Xunit.Assert;
using Xunit;
namespace CEZ3._0.Application.Users.Command.ChangeUserRole.Tests
{
    public class ChangeUserRoleCommandHandlerTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly Mock<ILogger<ChangeUserRoleCommandHandler>> _loggerMock = new();
        private readonly ChangeUserRoleCommandHandler _handler;

        public ChangeUserRoleCommandHandlerTests()
        {
            _handler = new ChangeUserRoleCommandHandler(
                _userRepositoryMock.Object,
                _loggerMock.Object);
        }

        private static string NewId() => ObjectId.GenerateNewId().ToString();

        // ------------------------------------------------------------------
        // Sad paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_InvalidUserIdFormat_ThrowsBadRequestException()
        {
            var command = new ChangeUserRoleCommand
            {
                UserId = "not-valid-objectid",
                Role = UserRoles.Teacher.ToString()
            };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        [Theory]
        [InlineData("NotARole")]
        [InlineData("superadmin")]
        [InlineData("")]
        public async Task Handle_InvalidRole_ThrowsBadRequestException(string invalidRole)
        {
            var command = new ChangeUserRoleCommand
            {
                UserId = NewId(),
                Role = invalidRole
            };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task Handle_UserNotFound_ThrowsBadRequestException()
        {
            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync((User?)null);

            var command = new ChangeUserRoleCommand
            {
                UserId = NewId(),
                Role = UserRoles.Teacher.ToString()
            };

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(command, CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy paths
        // ------------------------------------------------------------------

        [Theory]
        [InlineData("Student")]
        [InlineData("Teacher")]
        [InlineData("Admin")]
        public async Task Handle_ValidRequest_UpdatesRoleAndSavesChanges(string newRole)
        {
            var userId = NewId();
            var user = new User { Id = ObjectId.Parse(userId), Role = UserRoles.Student.ToString() };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(user);

            var command = new ChangeUserRoleCommand { UserId = userId, Role = newRole };

            await _handler.Handle(command, CancellationToken.None);

            Assert.Equal(newRole, user.Role);
            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Handle_RoleCaseInsensitive_UpdatesRole()
        {
            var userId = NewId();
            var user = new User { Id = ObjectId.Parse(userId), Role = UserRoles.Student.ToString() };

            _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
                .ReturnsAsync(user);

            var command = new ChangeUserRoleCommand { UserId = userId, Role = "teacher" };

            await _handler.Handle(command, CancellationToken.None);

            _userRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }
    }
}