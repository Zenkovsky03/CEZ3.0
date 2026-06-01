using CEZ3._0.Application.Contracts.Responses.Courses;
using CEZ3._0.Application.Courses.Query.GetCourseById;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Courses.Query.GetCourseById.Tests;

public class GetCourseByIdQueryHandlerTests
{
    private readonly Mock<ILogger<GetCourseByIdQueryHandler>> _loggerMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly GetCourseByIdQueryHandler _handler;

    public GetCourseByIdQueryHandlerTests()
    {
        _handler = new GetCourseByIdQueryHandler(
            _loggerMock.Object,
            _courseRepositoryMock.Object);
    }

    private static string NewId() => ObjectId.GenerateNewId().ToString();

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_InvalidCourseIdFormat_ThrowsBadRequestException()
    {
        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new GetCourseByIdQuery("bad-id"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CourseNotFound_ThrowsNotFoundException()
    {
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync((Course?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(new GetCourseByIdQuery(NewId()), CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy path
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_CourseExists_ReturnsMappedCourseResponse()
    {
        var courseId = ObjectId.GenerateNewId();
        var ownerId = ObjectId.GenerateNewId();
        var created = new DateTime(2024, 3, 1);

        var course = new Course
        {
            Id = courseId,
            Name = "Fizyka II",
            Description = "Kurs zaawansowany",
            StartDate = new DateTime(2025, 10, 1),
            EndDate = new DateTime(2026, 2, 28),
            Archived = false,
            OwnerId = ownerId,
            CreatedAt = created,
            IsPasswordProtected = true
        };

        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(course);

        var result = await _handler.Handle(new GetCourseByIdQuery(courseId.ToString()), CancellationToken.None);

        Assert.Equal(courseId.ToString(), result.Id);
        Assert.Equal("Fizyka II", result.Name);
        Assert.Equal("Kurs zaawansowany", result.Description);
        Assert.Equal(new DateTime(2025, 10, 1), result.StartDate);
        Assert.Equal(new DateTime(2026, 2, 28), result.EndDate);
        Assert.False(result.Archived);
        Assert.Equal(ownerId.ToString(), result.OwnerId);
        Assert.Equal(created, result.CreatedAt);
        Assert.True(result.IsPasswordProtected);
    }
}