using CEZ3._0.Application.Courses.Query.IsUserEnroll;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Courses.Query.IsUserEnroll.Tests;

public class IsUserEnrollQueryHandlerTests
{
    private readonly Mock<ILogger<IsUserEnrollQueryHandler>> _loggerMock = new();
    private readonly Mock<IUserContext> _userContextMock = new();
    private readonly Mock<ICourseEnrollmentRepository> _enrollmentRepositoryMock = new();
    private readonly IsUserEnrollQueryHandler _handler;

    public IsUserEnrollQueryHandlerTests()
    {
        _handler = new IsUserEnrollQueryHandler(
            _loggerMock.Object,
            _userContextMock.Object,
            _enrollmentRepositoryMock.Object);
    }

    private static ObjectId NewObjectId() => ObjectId.GenerateNewId();
    private static string NewId() => ObjectId.GenerateNewId().ToString();

    private void SetCurrentUser(string id, string role = "Student") =>
        _userContextMock.Setup(x => x.GetCurrentUser())
            .Returns(new CurrentUser(id, "student@test.com", role));

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
    {
        _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(() =>
            _handler.Handle(new IsUserEnrollQuery(NewObjectId()), CancellationToken.None));
    }

    [Theory]
    [InlineData("Admin")]
    [InlineData("Teacher")]
    public async Task Handle_NonStudentRole_ThrowsForbiddenException(string role)
    {
        SetCurrentUser(NewId(), role);

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            _handler.Handle(new IsUserEnrollQuery(NewObjectId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidUserIdInContext_ThrowsUnauthorizedException()
    {
        // Simulate a corrupted JWT where user ID is not a valid ObjectId
        _userContextMock.Setup(x => x.GetCurrentUser())
            .Returns(new CurrentUser("not-valid-objectid", "s@test.com", UserRoles.Student.ToString()));

        await Assert.ThrowsAsync<UnauthorizedException>(() =>
            _handler.Handle(new IsUserEnrollQuery(NewObjectId()), CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_StudentIsEnrolled_ReturnsTrue()
    {
        var userId = NewId();
        var courseId = NewObjectId();

        SetCurrentUser(userId);
        _enrollmentRepositoryMock.Setup(x =>
                x.IfStudentEnrolledAsync(courseId, It.IsAny<ObjectId>()))
            .ReturnsAsync(true);

        var result = await _handler.Handle(new IsUserEnrollQuery(courseId), CancellationToken.None);

        Assert.True(result);
    }

    [Fact]
    public async Task Handle_StudentIsNotEnrolled_ReturnsFalse()
    {
        var userId = NewId();
        var courseId = NewObjectId();

        SetCurrentUser(userId);
        _enrollmentRepositoryMock.Setup(x =>
                x.IfStudentEnrolledAsync(courseId, It.IsAny<ObjectId>()))
            .ReturnsAsync(false);

        var result = await _handler.Handle(new IsUserEnrollQuery(courseId), CancellationToken.None);

        Assert.False(result);
    }
}