using CEZ3._0.Application.Contracts.Responses.Courses;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Query.GetCourseById;

public class GetCourseByIdQueryHandler(
    ILogger<GetCourseByIdQueryHandler> logger,
    ICourseRepository courseRepository) : IRequestHandler<GetCourseByIdQuery, CourseResponse>
{
    public async Task<CourseResponse> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetCourseByIdQuery for Id: {Id}", request.Id);

        if (!ObjectId.TryParse(request.Id, out var objectId))
            throw new BadRequestException("Invalid Course ID format.");

        var course = await courseRepository.GetByIdAsync(objectId);

        if (course is null)
            throw new NotFoundException($"Course with ID {request.Id} was not found.");

        return new CourseResponse
        {
            Id = course.Id.ToString(),
            Name = course.Name,
            Description = course.Description,
            StartDate = course.StartDate,
            EndDate = course.EndDate,
            Archived = course.Archived,
            OwnerId = course.OwnerId.ToString(),
            CreatedAt = course.CreatedAt,
            IsPasswordProtected = course.IsPasswordProtected
        };
    }
}