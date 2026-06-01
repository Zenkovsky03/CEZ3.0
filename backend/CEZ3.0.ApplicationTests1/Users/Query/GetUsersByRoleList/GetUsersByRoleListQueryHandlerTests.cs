using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Application.Users.Query.GetUsersByRoleList;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Query.GetUsersByRoleList.Tests
{
    public class GetUsersByRoleListQueryHandlerTests
    {
        private readonly Mock<ILogger<GetUsersByRoleListQueryHandler>> _loggerMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly GetUsersByRoleListQueryHandler _handler;

        public GetUsersByRoleListQueryHandlerTests()
        {
            _handler = new GetUsersByRoleListQueryHandler(
                _loggerMock.Object,
                _userRepositoryMock.Object);
        }

        // ------------------------------------------------------------------
        // Tests
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_NoUsersForRole_ReturnsEmptyList()
        {
            _userRepositoryMock.Setup(x => x.GetUsersByRoleAsync(UserRoles.Teacher.ToString()))
                .ReturnsAsync(new List<User>());

            var result = await _handler.Handle(
                new GetUsersByRoleListQuery(UserRoles.Teacher.ToString()),
                CancellationToken.None);

            Assert.Empty(result);
        }

        [Fact]
        public async Task Handle_UsersExistForRole_ReturnsMappedDtoList()
        {
            var id1 = ObjectId.GenerateNewId();
            var id2 = ObjectId.GenerateNewId();
            var users = new List<User>
        {
            new()
            {
                Id = id1,
                FirstName = "Anna",
                LastName = "Nowak",
                Username = "anowak",
                Email = "anna@test.com",
                Role = UserRoles.Teacher.ToString(),
                IsActive = true,
                IsBlocked = false,
                CreatedAt = new DateTime(2024, 1, 1)
            },
            new()
            {
                Id = id2,
                FirstName = "Piotr",
                LastName = "Wiśniewski",
                Username = "pwisniewski",
                Email = "piotr@test.com",
                Role = UserRoles.Teacher.ToString(),
                IsActive = true,
                IsBlocked = false,
                CreatedAt = new DateTime(2024, 3, 15)
            }
        };

            _userRepositoryMock.Setup(x => x.GetUsersByRoleAsync(UserRoles.Teacher.ToString()))
                .ReturnsAsync(users);

            var result = await _handler.Handle(
                new GetUsersByRoleListQuery(UserRoles.Teacher.ToString()),
                CancellationToken.None);

            Assert.Equal(2, result.Count);

            Assert.Equal(id1.ToString(), result[0].Id);
            Assert.Equal("Anna", result[0].FirstName);
            Assert.Equal("anna@test.com", result[0].Email);
            Assert.Equal(UserRoles.Teacher.ToString(), result[0].Role);

            Assert.Equal(id2.ToString(), result[1].Id);
            Assert.Equal("Piotr", result[1].FirstName);
        }

        [Fact]
        public async Task Handle_MapsAllUserDtoFields()
        {
            var objectId = ObjectId.GenerateNewId();
            var created = new DateTime(2023, 6, 10);
            var user = new User
            {
                Id = objectId,
                FirstName = "Test",
                LastName = "User",
                Username = "tuser",
                Email = "test@test.com",
                Role = UserRoles.Student.ToString(),
                IsActive = false,
                IsBlocked = true,
                CreatedAt = created
            };

            _userRepositoryMock.Setup(x => x.GetUsersByRoleAsync(It.IsAny<string>()))
                .ReturnsAsync(new List<User> { user });

            var result = await _handler.Handle(
                new GetUsersByRoleListQuery(UserRoles.Student.ToString()),
                CancellationToken.None);

            var dto = result.Single();
            Assert.Equal(objectId.ToString(), dto.Id);
            Assert.Equal("Test", dto.FirstName);
            Assert.Equal("User", dto.LastName);
            Assert.Equal("tuser", dto.Username);
            Assert.Equal("test@test.com", dto.Email);
            Assert.Equal(UserRoles.Student.ToString(), dto.Role);
            Assert.False(dto.IsActive);
            Assert.True(dto.IsBlocked);
            Assert.Equal(created, dto.CreatedAt);
        }
    }
}