using CEZ3._0.Application.Courses.Query.GetCourses;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using Microsoft.Extensions.Logging;
using Moq;
using MongoDB.Bson;
using Xunit;
using Assert = Xunit.Assert;

namespace CEZ3._0.Application.Courses.Query.GetCourses.Tests;

public class GetCoursesQueryHandlerTests
{
    private readonly Mock<ILogger<GetCoursesQueryHandler>> _loggerMock = new();
    private readonly Mock<ICourseRepository> _courseRepositoryMock = new();
    private readonly GetCoursesQueryHandler _handler;

    public GetCoursesQueryHandlerTests()
    {
        _handler = new GetCoursesQueryHandler(
            _loggerMock.Object,
            _courseRepositoryMock.Object);
    }

    // ------------------------------------------------------------------
    // Tests
    // ------------------------------------------------------------------

    [Fact]
    public async Task Handle_NoCourses_ReturnsEmptyCollection()
    {
        _courseRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<bool>()))
            .ReturnsAsync(new List<Course>());

        var result = await _handler.Handle(new GetCoursesQuery(), CancellationToken.None);

        Assert.Empty(result);
    }

    [Fact]
    public async Task Handle_CoursesExist_ReturnsMappedResponses()
    {
        var id1 = ObjectId.GenerateNewId();
        var id2 = ObjectId.GenerateNewId();
        var owner1 = ObjectId.GenerateNewId();
        var owner2 = ObjectId.GenerateNewId();

        var courses = new List<Course>
        {
            new()
            {
                Id = id1,
                Name = "Chemia",
                Description = "Podstawy",
                StartDate = new DateTime(2025, 9, 1),
                EndDate = new DateTime(2026, 1, 31),
                Archived = false,
                OwnerId = owner1,
                CreatedAt = new DateTime(2024, 1, 1),
                IsPasswordProtected = false
            },
            new()
            {
                Id = id2,
                Name = "Biologia",
                Description = "Zaawansowana",
                StartDate = new DateTime(2025, 10, 1),
                EndDate = new DateTime(2026, 3, 1),
                Archived = true,
                OwnerId = owner2,
                CreatedAt = new DateTime(2024, 2, 1),
                IsPasswordProtected = true
            }
        };

        _courseRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<bool>())).ReturnsAsync(courses);

        var result = (await _handler.Handle(new GetCoursesQuery(), CancellationToken.None)).ToList();

        Assert.Equal(2, result.Count);

        Assert.Equal(id1.ToString(), result[0].Id);
        Assert.Equal("Chemia", result[0].Name);
        Assert.False(result[0].Archived);
        Assert.Equal(owner1.ToString(), result[0].OwnerId);

        Assert.Equal(id2.ToString(), result[1].Id);
        Assert.Equal("Biologia", result[1].Name);
        Assert.True(result[1].Archived);
        Assert.True(result[1].IsPasswordProtected);
    }

    [Fact]
    public async Task Handle_MapsAllResponseFields()
    {
        var courseId = ObjectId.GenerateNewId();
        var ownerId = ObjectId.GenerateNewId();
        var created = new DateTime(2023, 11, 5);

        var course = new Course
        {
            Id = courseId,
            Name = "Informatyka",
            Description = "Full stack",
            StartDate = new DateTime(2025, 9, 1),
            EndDate = new DateTime(2026, 6, 30),
            Archived = false,
            OwnerId = ownerId,
            CreatedAt = created,
            IsPasswordProtected = false
        };

        _courseRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<bool>()))
            .ReturnsAsync(new List<Course> { course });

        var result = (await _handler.Handle(new GetCoursesQuery(), CancellationToken.None)).Single();

        Assert.Equal(courseId.ToString(), result.Id);
        Assert.Equal("Informatyka", result.Name);
        Assert.Equal("Full stack", result.Description);
        Assert.Equal(new DateTime(2025, 9, 1), result.StartDate);
        Assert.Equal(new DateTime(2026, 6, 30), result.EndDate);
        Assert.False(result.Archived);
        Assert.Equal(ownerId.ToString(), result.OwnerId);
        Assert.Equal(created, result.CreatedAt);
        Assert.False(result.IsPasswordProtected);
    }
}