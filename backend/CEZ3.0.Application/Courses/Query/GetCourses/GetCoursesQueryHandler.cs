using CEZ3._0.Application.Contracts.Responses.Courses;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Courses.Query.GetCourses;

public class GetCoursesQueryHandler(
    ILogger<GetCoursesQueryHandler> logger,
    ICourseRepository courseRepository) : IRequestHandler<GetCoursesQuery, IEnumerable<CourseResponse>>
{
    public async Task<IEnumerable<CourseResponse>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetCoursesQuery");

        var courses = await courseRepository.GetAllAsync();

        return courses.Select(c => new CourseResponse
        {
            Id = c.Id.ToString(),
            Name = c.Name,
            Description = c.Description,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            Archived = c.Archived,
            OwnerId = c.OwnerId.ToString(),
            CreatedAt = c.CreatedAt,
            IsPasswordProtected = c.IsPasswordProtected
        });
    }
}