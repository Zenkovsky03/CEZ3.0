using CEZ3._0.Application.Courses.Command.AssignTeacher;
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

namespace CEZ3._0.Application.Courses.Command.AssignTeacher.Tests;

public class AssignTeacherCommandHandlerTests
{
    private readonly Mock<ILogger<AssignTeacherCommandHandler>> _loggerMock = new();
    private readonly Mock<IUserContext> _userContextMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly Mock<IUserRepository> _userRepositoryMock = new();
    private readonly AssignTeacherCommandHandler _handler;

    public AssignTeacherCommandHandlerTests()
    {
        _handler = new AssignTeacherCommandHandler(
            _loggerMock.Object,
            _userContextMock.Object,
            _courseRepositoryMock.Object,
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
            _handler.Handle(new AssignTeacherCommand(NewId(), NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CurrentUserNotAdmin_ThrowsForbiddenException()
    {
        SetCurrentUser(NewId(), UserRoles.Teacher.ToString());

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            _handler.Handle(new AssignTeacherCommand(NewId(), NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidCourseIdFormat_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new AssignTeacherCommand("bad-course-id", NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidTeacherIdFormat_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new AssignTeacherCommand(NewId(), "bad-teacher-id"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CourseNotFound_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync((Course?)null);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new AssignTeacherCommand(NewId(), NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_TeacherNotFound_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course());
        _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync((User?)null);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new AssignTeacherCommand(NewId(), NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_UserFoundButNotTeacherRole_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course());
        _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new User { Role = UserRoles.Student.ToString() });

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new AssignTeacherCommand(NewId(), NewId()), CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy path
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_ValidRequest_AssignsTeacherAndSavesChanges()
    {
        var teacherId = NewId();
        var teacherObjectId = ObjectId.Parse(teacherId);
        var course = new Course { OwnerId = ObjectId.GenerateNewId() };
        var teacher = new User { Id = teacherObjectId, Role = UserRoles.Teacher.ToString() };

        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(course);
        _userRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(teacher);

        await _handler.Handle(new AssignTeacherCommand(NewId(), teacherId), CancellationToken.None);

        Assert.Equal(teacherObjectId, course.OwnerId);
        _courseRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}