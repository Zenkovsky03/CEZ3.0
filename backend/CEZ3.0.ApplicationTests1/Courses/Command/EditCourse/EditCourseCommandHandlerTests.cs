using CEZ3._0.Application.Courses.Command.EditCourse;
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

namespace CEZ3._0.Application.Courses.Command.EditCourse.Tests;

public class EditCourseCommandHandlerTests
{
    private readonly Mock<ILogger<EditCourseCommandHandler>> _loggerMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly Mock<IUserContext> _userContextMock = new();
    private readonly EditCourseCommandHandler _handler;

    public EditCourseCommandHandlerTests()
    {
        _handler = new EditCourseCommandHandler(
            _loggerMock.Object,
            _courseRepositoryMock.Object,
            _userContextMock.Object);
    }

    private static string NewId() => ObjectId.GenerateNewId().ToString();

    private void SetCurrentUser(string id, string role = "Admin") =>
        _userContextMock.Setup(x => x.GetCurrentUser())
            .Returns(new CurrentUser(id, "user@test.com", role));

    private static EditCourseCommand ValidCommand(string courseId) => new()
    {
        CourseId = courseId,
        Name = "Nowa Nazwa",
        Description = "Nowy opis",
        StartDate = new DateTime(2025, 9, 1),
        EndDate = new DateTime(2026, 1, 31)
    };

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
    {
        _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(() =>
            _handler.Handle(ValidCommand(NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidCourseIdFormat_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(ValidCommand("bad-course-id"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CourseNotFound_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync((Course?)null);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(ValidCommand(NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NotAdminAndNotOwner_ThrowsForbiddenException()
    {
        var currentUserId = NewId();
        var ownerId = NewId();
        var courseId = NewId();

        SetCurrentUser(currentUserId, UserRoles.Teacher.ToString());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course { OwnerId = ObjectId.Parse(ownerId) });

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            _handler.Handle(ValidCommand(courseId), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NameAlreadyTakenByAnotherCourse_ThrowsBadRequestException()
    {
        var adminId = NewId();
        var courseId = NewId();

        SetCurrentUser(adminId);
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course { Name = "Stara Nazwa" });
        _courseRepositoryMock.Setup(x => x.GetByNameAsync("Nowa Nazwa"))
            .ReturnsAsync(new Course { Name = "Nowa Nazwa" });

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(ValidCommand(courseId), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_EndDateBeforeStartDate_ThrowsBadRequestException()
    {
        var adminId = NewId();
        var courseId = NewId();

        SetCurrentUser(adminId);
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course { Name = "Stara Nazwa" });
        _courseRepositoryMock.Setup(x => x.GetByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        var command = ValidCommand(courseId);
        command.StartDate = new DateTime(2026, 6, 1);
        command.EndDate = new DateTime(2025, 1, 1);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(command, CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_AdminEditsAnyCourse_UpdatesFieldsAndSaves()
    {
        var adminId = NewId();
        var courseId = NewId();
        var existingCourse = new Course
        {
            Name = "Stara Nazwa",
            Description = "Stary opis",
            StartDate = new DateTime(2024, 1, 1),
            EndDate = new DateTime(2024, 6, 1)
        };

        SetCurrentUser(adminId);
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(existingCourse);
        _courseRepositoryMock.Setup(x => x.GetByNameAsync("Nowa Nazwa"))
            .ReturnsAsync((Course?)null);

        await _handler.Handle(ValidCommand(courseId), CancellationToken.None);

        Assert.Equal("Nowa Nazwa", existingCourse.Name);
        Assert.Equal("Nowy opis", existingCourse.Description);
        Assert.Equal(new DateTime(2025, 9, 1), existingCourse.StartDate);
        Assert.Equal(new DateTime(2026, 1, 31), existingCourse.EndDate);
        _courseRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task Handle_OwnerEditsOwnCourse_UpdatesFieldsAndSaves()
    {
        var ownerId = NewId();
        var courseId = NewId();
        var existingCourse = new Course
        {
            OwnerId = ObjectId.Parse(ownerId),
            Name = "Stara Nazwa"
        };

        SetCurrentUser(ownerId, UserRoles.Teacher.ToString());
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(existingCourse);
        _courseRepositoryMock.Setup(x => x.GetByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        await _handler.Handle(ValidCommand(courseId), CancellationToken.None);

        Assert.Equal("Nowa Nazwa", existingCourse.Name);
        _courseRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task Handle_SameNameAsExistingCourse_DoesNotCheckForDuplicateAndSaves()
    {
        var adminId = NewId();
        var courseId = NewId();
        var existingCourse = new Course { Name = "Nowa Nazwa" };

        SetCurrentUser(adminId);
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(existingCourse);

        await _handler.Handle(ValidCommand(courseId), CancellationToken.None);

        // GetByNameAsync should NOT be called when the name hasn't changed
        _courseRepositoryMock.Verify(x => x.GetByNameAsync(It.IsAny<string>()), Times.Never);
        _courseRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}