using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Application.Users.Query.GetUsersList;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Users.Query.GetUsersList.Tests
{
    public class GetUsersListQueryHandlerTests
    {
        private readonly Mock<ILogger<GetUsersListQueryHandler>> _loggerMock = new();
        private readonly Mock<IUserContext> _userContextMock = new();
        private readonly Mock<IUserRepository> _userRepositoryMock = new();
        private readonly GetUsersListQueryHandler _handler;

        public GetUsersListQueryHandlerTests()
        {
            _handler = new GetUsersListQueryHandler(
                _loggerMock.Object,
                _userContextMock.Object,
                _userRepositoryMock.Object);
        }

        private void SetCurrentUser(string id, string role = "Admin") =>
            _userContextMock.Setup(x => x.GetCurrentUser())
                .Returns(new CurrentUser(id, "admin@test.com", role));

        private static GetUsersListQuery DefaultQuery() => new()
        {
            PageNumber = 1,
            PageSize = 10
        };

        // ------------------------------------------------------------------
        // Sad paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
        {
            _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

            await Assert.ThrowsAsync<UnauthorizedException>(() =>
                _handler.Handle(DefaultQuery(), CancellationToken.None));
        }

        [Fact]
        public async Task Handle_CurrentUserNotAdmin_ThrowsForbiddenException()
        {
            SetCurrentUser(ObjectId.GenerateNewId().ToString(), UserRoles.Student.ToString());

            await Assert.ThrowsAsync<ForbiddenException>(() =>
                _handler.Handle(DefaultQuery(), CancellationToken.None));
        }

        // ------------------------------------------------------------------
        // Happy paths
        // ------------------------------------------------------------------

        [Fact]
        public async Task Handle_AdminRequest_ReturnsPagedResult()
        {
            SetCurrentUser(ObjectId.GenerateNewId().ToString());

            var users = new List<User>
        {
            new() { Id = ObjectId.GenerateNewId(), FirstName = "Jan", LastName = "K", Username = "jk", Email = "jan@test.com", Role = "Student", IsActive = true }
        };

            _userRepositoryMock.Setup(x =>
                    x.GetUsersAsync(1, 10, null, null, null, null))
                .ReturnsAsync(users);
            _userRepositoryMock.Setup(x => x.GetTotalUsersCountAsync())
                .ReturnsAsync(1);

            var result = await _handler.Handle(DefaultQuery(), CancellationToken.None);

            Assert.NotNull(result);
            Assert.Equal(1, result.Items.Count);
            Assert.Equal(1, result.TotalItemCount);
            Assert.Equal(1, result.TotalPage);
        }

        [Fact]
        public async Task Handle_AdminRequest_MapsDtoFieldsCorrectly()
        {
            SetCurrentUser(ObjectId.GenerateNewId().ToString());

            var objectId = ObjectId.GenerateNewId();
            var created = new DateTime(2023, 5, 20);
            var user = new User
            {
                Id = objectId,
                FirstName = "Maria",
                LastName = "Nowak",
                Username = "mnowak",
                Email = "maria@test.com",
                Role = UserRoles.Teacher.ToString(),
                IsActive = true,
                IsBlocked = false,
                CreatedAt = created
            };

            _userRepositoryMock.Setup(x =>
                    x.GetUsersAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool?>(),
                        It.IsAny<bool?>(), It.IsAny<string?>(), It.IsAny<string?>()))
                .ReturnsAsync(new List<User> { user });
            _userRepositoryMock.Setup(x => x.GetTotalUsersCountAsync())
                .ReturnsAsync(1);

            var result = await _handler.Handle(DefaultQuery(), CancellationToken.None);

            var dto = result.Items.Single();
            Assert.Equal(objectId.ToString(), dto.Id);
            Assert.Equal("Maria", dto.FirstName);
            Assert.Equal("Nowak", dto.LastName);
            Assert.Equal("mnowak", dto.Username);
            Assert.Equal("maria@test.com", dto.Email);
            Assert.Equal(UserRoles.Teacher.ToString(), dto.Role);
            Assert.True(dto.IsActive);
            Assert.False(dto.IsBlocked);
            Assert.Equal(created, dto.CreatedAt);
        }

        [Fact]
        public async Task Handle_EmptyRepository_ReturnsEmptyPagedResult()
        {
            SetCurrentUser(ObjectId.GenerateNewId().ToString());

            _userRepositoryMock.Setup(x =>
                    x.GetUsersAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool?>(),
                        It.IsAny<bool?>(), It.IsAny<string?>(), It.IsAny<string?>()))
                .ReturnsAsync(new List<User>());
            _userRepositoryMock.Setup(x => x.GetTotalUsersCountAsync())
                .ReturnsAsync(0);

            var result = await _handler.Handle(DefaultQuery(), CancellationToken.None);

            Assert.Empty(result.Items);
            Assert.Equal(0, result.TotalItemCount);
        }
    }
}