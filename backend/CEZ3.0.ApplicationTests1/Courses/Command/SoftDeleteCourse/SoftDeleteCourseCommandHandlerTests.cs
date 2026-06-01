using CEZ3._0.Application.Courses.Command.SoftDeleteCourse;
using CEZ3._0.Application.Interfaces;
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

namespace CEZ3._0.Application.Courses.Command.SoftDeleteCourse.Tests;

public class SoftDeleteCourseCommandHandlerTests
{
    private readonly Mock<ILogger<SoftDeleteCourseCommandHandler>> _loggerMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly Mock<IUserContext> _userContextMock = new();
    private readonly SoftDeleteCourseCommandHandler _handler;

    public SoftDeleteCourseCommandHandlerTests()
    {
        _handler = new SoftDeleteCourseCommandHandler(
            _loggerMock.Object,
            _courseRepositoryMock.Object,
            _userContextMock.Object);
    }

    private static string NewId() => ObjectId.GenerateNewId().ToString();

    private void SetCurrentUser(string id, string role = "Admin") =>
        _userContextMock.Setup(x => x.GetCurrentUser())
            .Returns(new CurrentUser(id, "user@test.com", role));

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
    {
        _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(() =>
            _handler.Handle(new SoftDeleteCourseCommand(NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidCourseIdFormat_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new SoftDeleteCourseCommand("bad-course-id"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CourseNotFound_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync((Course?)null);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new SoftDeleteCourseCommand(NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NotAdminAndNotOwner_ThrowsForbiddenException()
    {
        var currentUserId = NewId();
        var ownerId = NewId();

        SetCurrentUser(currentUserId, UserRoles.Teacher.ToString());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course { OwnerId = ObjectId.Parse(ownerId) });

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            _handler.Handle(new SoftDeleteCourseCommand(NewId()), CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_AdminDeletesAnyCourse_SetsArchivedTrueAndSaves()
    {
        var adminId = NewId();
        var course = new Course { Archived = false };

        SetCurrentUser(adminId);
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(course);

        await _handler.Handle(new SoftDeleteCourseCommand(NewId()), CancellationToken.None);

        Assert.True(course.Archived);
        _courseRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task Handle_OwnerDeletesOwnCourse_SetsArchivedTrueAndSaves()
    {
        var ownerId = NewId();
        var course = new Course
        {
            OwnerId = ObjectId.Parse(ownerId),
            Archived = false
        };

        SetCurrentUser(ownerId, UserRoles.Teacher.ToString());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(course);

        await _handler.Handle(new SoftDeleteCourseCommand(NewId()), CancellationToken.None);

        Assert.True(course.Archived);
        _courseRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}