using CEZ3._0.Application.Courses.Command.CreateCourse;
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

namespace CEZ3._0.Application.Courses.Command.CreateCourse.Tests;

public class CreateCourseCommandHandlerTests
{
    private readonly Mock<ILogger<CreateCourseCommandHandler>> _loggerMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly Mock<IUserContext> _userContextMock = new();
    private readonly CreateCourseCommandHandler _handler;

    public CreateCourseCommandHandlerTests()
    {
        _handler = new CreateCourseCommandHandler(
            _loggerMock.Object,
            _courseRepositoryMock.Object,
            _userContextMock.Object);
    }

    private static string NewId() => ObjectId.GenerateNewId().ToString();

    private void SetCurrentUser(string id, string role = "Teacher") =>
        _userContextMock.Setup(x => x.GetCurrentUser())
            .Returns(new CurrentUser(id, "teacher@test.com", role));

    private static CreateCourseCommand ValidCommand(bool isPasswordProtected = false, string? password = null) => new()
    {
        Name = "Matematyka I",
        Description = "Kurs podstawowy",
        StartDate = new DateTime(2025, 9, 1),
        EndDate = new DateTime(2026, 1, 31),
        IsPasswordProtected = isPasswordProtected,
        Password = password
    };

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
    {
        _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(() =>
            _handler.Handle(ValidCommand(), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_StudentRole_ThrowsForbiddenException()
    {
        SetCurrentUser(NewId(), UserRoles.Student.ToString());

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            _handler.Handle(ValidCommand(), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_EndDateBeforeStartDate_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());

        var command = ValidCommand();
        command.StartDate = new DateTime(2026, 1, 1);
        command.EndDate = new DateTime(2025, 1, 1);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_EndDateEqualStartDate_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());

        var sameDate = new DateTime(2025, 9, 1);
        var command = ValidCommand();
        command.StartDate = sameDate;
        command.EndDate = sameDate;

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CourseNameAlreadyExists_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByNameAsync("Matematyka I"))
            .ReturnsAsync(new Course { Name = "Matematyka I" });

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(ValidCommand(), CancellationToken.None));

        _courseRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Course>()), Times.Never);
    }

    [Fact]
    public async Task Handle_PasswordProtectedWithoutPassword_ThrowsBadRequestException()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        var command = ValidCommand(isPasswordProtected: true, password: null);

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(command, CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    [Theory]
    [InlineData("Teacher")]
    [InlineData("Admin")]
    public async Task Handle_TeacherOrAdmin_CreatesCourseAndReturnsId(string role)
    {
        SetCurrentUser(NewId(), role);
        _courseRepositoryMock.Setup(x => x.GetByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        Course? savedCourse = null;
        _courseRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Course>()))
            .Callback<Course>(c => savedCourse = c);

        var result = await _handler.Handle(ValidCommand(), CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(ObjectId.TryParse(result, out _), "Returned ID should be a valid ObjectId.");
        _courseRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Course>()), Times.Once);

        Assert.NotNull(savedCourse);
        Assert.Equal("Matematyka I", savedCourse!.Name);
        Assert.False(savedCourse.Archived);
        Assert.False(savedCourse.IsPasswordProtected);
        Assert.Null(savedCourse.PasswordHash);
    }

    [Fact]
    public async Task Handle_PasswordProtectedWithPassword_HashesAndStoresPassword()
    {
        SetCurrentUser(NewId());
        _courseRepositoryMock.Setup(x => x.GetByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((Course?)null);

        Course? savedCourse = null;
        _courseRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Course>()))
            .Callback<Course>(c => savedCourse = c);

        await _handler.Handle(ValidCommand(isPasswordProtected: true, password: "secret123"), CancellationToken.None);

        Assert.NotNull(savedCourse);
        Assert.True(savedCourse!.IsPasswordProtected);
        Assert.NotNull(savedCourse.PasswordHash);
        Assert.NotEqual("secret123", savedCourse.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("secret123", savedCourse.PasswordHash));
    }
}