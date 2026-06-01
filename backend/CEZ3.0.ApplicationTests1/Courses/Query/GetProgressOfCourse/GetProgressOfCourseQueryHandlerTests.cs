using CEZ3._0.Application.Courses.Query.GetProgressOfCourse;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Courses.Query.GetProgressOfCourse.Tests;

public class GetProgressOfCourseQueryHandlerTests
{
    private readonly Mock<ILogger<GetProgressOfCourseQueryHandler>> _loggerMock = new();
    private readonly Mock<IUserContext> _userContextMock = new();
    private readonly Mock<ICourseSectionRepository> _courseSectionRepositoryMock = new();
    private readonly GetProgressOfCourseQueryHandler _handler;

    public GetProgressOfCourseQueryHandlerTests()
    {
        _handler = new GetProgressOfCourseQueryHandler(
            _loggerMock.Object,
            _userContextMock.Object,
            _courseSectionRepositoryMock.Object);
    }

    private static string NewId() => ObjectId.GenerateNewId().ToString();

    private void SetCurrentUser(string id = "Student") =>
        _userContextMock.Setup(x => x.GetCurrentUser())
            .Returns(new CurrentUser(NewId(), "student@test.com", id));

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_NoCurrentUser_ThrowsUnauthorizedException()
    {
        _userContextMock.Setup(x => x.GetCurrentUser()).Returns((CurrentUser?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(() =>
            _handler.Handle(new GetProgressOfCourseQuery(NewId()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidCourseIdFormat_ThrowsBadRequestException()
    {
        SetCurrentUser();

        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new GetProgressOfCourseQuery("bad-id"), CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_ValidCourse_ReturnsProgressWithCorrectValues()
    {
        SetCurrentUser();

        _courseSectionRepositoryMock.Setup(x => x.GetNumberOfAllSectionsAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(10);
        _courseSectionRepositoryMock.Setup(x => x.GetNumberOfCompletedSectionsAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(4);

        var result = await _handler.Handle(new GetProgressOfCourseQuery(NewId()), CancellationToken.None);

        Assert.Equal(10, result.TotalSections);
        Assert.Equal(4, result.CompletedSections);
    }

    [Fact]
    public async Task Handle_AllSectionsCompleted_ReturnsFullProgress()
    {
        SetCurrentUser();

        _courseSectionRepositoryMock.Setup(x => x.GetNumberOfAllSectionsAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(5);
        _courseSectionRepositoryMock.Setup(x => x.GetNumberOfCompletedSectionsAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(5);

        var result = await _handler.Handle(new GetProgressOfCourseQuery(NewId()), CancellationToken.None);

        Assert.Equal(result.TotalSections, result.CompletedSections);
    }

    [Fact]
    public async Task Handle_NoSections_ReturnsZeroProgress()
    {
        SetCurrentUser();

        _courseSectionRepositoryMock.Setup(x => x.GetNumberOfAllSectionsAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(0);
        _courseSectionRepositoryMock.Setup(x => x.GetNumberOfCompletedSectionsAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(0);

        var result = await _handler.Handle(new GetProgressOfCourseQuery(NewId()), CancellationToken.None);

        Assert.Equal(0, result.TotalSections);
        Assert.Equal(0, result.CompletedSections);
    }
}