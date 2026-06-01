using CEZ3._0.Application.Users.Command.CreateUser;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Command.CreateUser.Tests
{
    public class CreateUserCommandHandlerTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly Mock<ILogger<CreateUserCommandHandler>> _loggerMock = new();
        private readonly CreateUserCommandHandler _handler;

        public CreateUserCommandHandlerTests()
        {
            _handler = new CreateUserCommandHandler(
                _userRepositoryMock.Object,
                _loggerMock.Object);
        }

        private static CreateUserCommand ValidCommand() => new()
        {
            FirstName = "Jan",
            LastName = "Kowalski",
            Username = "jkowalski",
            Email = "jan@test.com",
            Password = "SecurePass1!"
        };

        // ------------------------------------------------------------------
        // Sad paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_UsernameAlreadyExists_ThrowsBadRequestException()
        {
            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync("jkowalski"))
                .ReturnsAsync(new User { Username = "jkowalski" });

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(ValidCommand(), CancellationToken.None));

            _userRepositoryMock.Verify(x => x.AddUserAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task Handle_EmailAlreadyExists_ThrowsBadRequestException()
        {
            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);
            _userRepositoryMock.Setup(x => x.GetUserByEmailAsync("jan@test.com"))
                .ReturnsAsync(new User { Email = "jan@test.com" });

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _handler.Handle(ValidCommand(), CancellationToken.None));

            _userRepositoryMock.Verify(x => x.AddUserAsync(It.IsAny<User>()), Times.Never);
        }

        // ------------------------------------------------------------------
        // Happy path
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_ValidRequest_CreatesUserWithCorrectDefaults()
        {
            _userRepositoryMock.Setup(x => x.GetUserByLoginAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);
            _userRepositoryMock.Setup(x => x.GetUserByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            User? savedUser = null;
            _userRepositoryMock.Setup(x => x.AddUserAsync(It.IsAny<User>()))
                .Callback<User>(u => savedUser = u);

            var command = ValidCommand();
            await _handler.Handle(command, CancellationToken.None);

            _userRepositoryMock.Verify(x => x.AddUserAsync(It.IsAny<User>()), Times.Once);

            Assert.NotNull(savedUser);
            Assert.Equal(command.FirstName, savedUser!.FirstName);
            Assert.Equal(command.LastName, savedUser.LastName);
            Assert.Equal(command.Username, savedUser.Username);
            Assert.Equal(command.Email, savedUser.Email);
            Assert.Equal(UserRoles.Student.ToString(), savedUser.Role);
            Assert.True(savedUser.IsActive);
            // Password must be hashed, not stored as plain text
            Assert.NotEqual(command.Password, savedUser.PasswordHash);
            Assert.True(BCrypt.Net.BCrypt.Verify(command.Password, savedUser.PasswordHash));
        }
    }
}