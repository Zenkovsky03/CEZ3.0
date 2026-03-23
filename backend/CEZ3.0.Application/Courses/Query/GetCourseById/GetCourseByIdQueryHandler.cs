using CEZ3._0.Application.Courses.Dtos;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Query.GetCourseById;

public class GetCourseByIdQueryHandler(
    ILogger<GetCourseByIdQueryHandler> logger,
    ICourseRepository courseRepository,
    IUserRepository userRepository,
    ICourseEnrollmentRepository enrollmentRepository) : IRequestHandler<GetCourseByIdQuery, CourseDto>
{
    public async Task<CourseDto> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetCourseByIdQuery for Id: {Id}", request.Id);

        if (!ObjectId.TryParse(request.Id, out var courseId))
            throw new BadRequestException("Invalid course ID format.");

        var course = await courseRepository.GetByIdAsync(courseId)
            ?? throw new NotFoundException("Course not found.");

        var owner = await userRepository.GetByIdAsync(course.OwnerId);
        var counts = await enrollmentRepository.GetEnrollmentCountsAsync([courseId]);
        counts.TryGetValue(courseId, out var participantsCount);

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
            ParticipantsCount = participantsCount,
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
    }
}
