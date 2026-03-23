using CEZ3._0.Application.Courses.Dtos;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Courses.Query.GetCourses;

public class GetCoursesQueryHandler(
    ILogger<GetCoursesQueryHandler> logger,
    ICourseRepository courseRepository,
    IUserRepository userRepository,
    ICourseEnrollmentRepository enrollmentRepository) : IRequestHandler<GetCoursesQuery, IEnumerable<CourseDto>>
{
    public async Task<IEnumerable<CourseDto>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetCoursesQuery");

        var courses = (await courseRepository.GetAllAsync()).OrderByDescending(c => c.CreatedAt).ToList();

        var ownerIds = courses.Select(c => c.OwnerId).Distinct().ToList();
        var owners = await userRepository.GetByIdsAsync(ownerIds);

        var courseIds = courses.Select(c => c.Id).ToList();
        var enrollmentCounts = await enrollmentRepository.GetEnrollmentCountsAsync(courseIds);

        return courses.Select(course =>
        {
            var owner = owners.FirstOrDefault(o => o.Id == course.OwnerId);
            enrollmentCounts.TryGetValue(course.Id, out var count);

            return new CourseDto
            {
                Id = course.Id.ToString(),
                Name = course.Name,
                Description = course.Description,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Archived = course.Archived,
                OwnerId = course.OwnerId.ToString(),
                CreatedAt = course.CreatedAt,
                IsPasswordProtected = course.IsPasswordProtected,
                ParticipantsCount = count,
                Owner = owner == null ? null! : new UserDto
                {
                    Id = owner.Id.ToString(),
                    FirstName = owner.FirstName,
                    LastName = owner.LastName,
                    Email = owner.Email,
                    Username = owner.Username,
                    Role = owner.Role,
                    IsActive = owner.IsActive,
                    CreatedAt = owner.CreatedAt
                }
            };
        });
    }
}
