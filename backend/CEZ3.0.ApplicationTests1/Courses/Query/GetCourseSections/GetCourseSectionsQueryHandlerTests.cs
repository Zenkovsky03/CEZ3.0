using CEZ3._0.Application.Courses.Query.GetCourseSections;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Courses.Query.GetCourseSections.Tests;

public class GetCourseSectionsQueryHandlerTests
{
    private readonly Mock<ILogger<GetCourseSectionsQueryHandler>> _loggerMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly Mock<ICourseSectionRepository> _courseSectionRepositoryMock = new();
    private readonly GetCourseSectionsQueryHandler _handler;

    public GetCourseSectionsQueryHandlerTests()
    {
        _handler = new GetCourseSectionsQueryHandler(
            _loggerMock.Object,
            _courseRepositoryMock.Object,
            _courseSectionRepositoryMock.Object);
    }

    private static string NewId() => ObjectId.GenerateNewId().ToString();

    // ------------------------------------------------------------------
    // Sad paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_InvalidCourseIdFormat_ThrowsBadRequestException()
    {
        await Assert.ThrowsAsync<BadRequestException>(() =>
            _handler.Handle(new GetCourseSectionsQuery("bad-id"), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CourseNotFound_ThrowsNotFoundException()
    {
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync((Course?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _handler.Handle(new GetCourseSectionsQuery(NewId()), CancellationToken.None));
    }

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_CourseExistsNoSections_ReturnsEmptyCollection()
    {
        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course());
        _courseSectionRepositoryMock.Setup(x => x.GetCourseSectionsByCourseIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new List<CourseSection>());

        var result = await _handler.Handle(new GetCourseSectionsQuery(NewId()), CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task Handle_CourseWithSections_ReturnsMappedResponses()
    {
        var courseObjectId = ObjectId.GenerateNewId();
        var section1Id = ObjectId.GenerateNewId();
        var section2Id = ObjectId.GenerateNewId();
        var created = new DateTime(2024, 5, 10);

        _courseRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(new Course { Id = courseObjectId });

        var sections = new List<CourseSection>
        {
            new()
            {
                Id = section1Id,
                CourseId = courseObjectId,
                Title = "Rozdział 1",
                OrderIndex = 1,
                CreatedAt = created,
                IsActive = true,
                IsFinalized = false
            },
            new()
            {
                Id = section2Id,
                CourseId = courseObjectId,
                Title = "Rozdział 2",
                OrderIndex = 2,
                CreatedAt = created,
                IsActive = true,
                IsFinalized = true
            }
        };

        _courseSectionRepositoryMock.Setup(x => x.GetCourseSectionsByCourseIdAsync(It.IsAny<ObjectId>()))
            .ReturnsAsync(sections);

        var result = (await _handler.Handle(
            new GetCourseSectionsQuery(courseObjectId.ToString()), CancellationToken.None)).ToList();

        Assert.Equal(2, result.Count);

        Assert.Equal(section1Id.ToString(), result[0].Id);
        Assert.Equal(courseObjectId.ToString(), result[0].CourseId);
        Assert.Equal("Rozdział 1", result[0].Title);
        Assert.Equal(1, result[0].OrderIndex);
        Assert.True(result[0].IsActive);
        Assert.False(result[0].IsFinalized);

        Assert.Equal(section2Id.ToString(), result[1].Id);
        Assert.Equal("Rozdział 2", result[1].Title);
        Assert.True(result[1].IsFinalized);
    }
}