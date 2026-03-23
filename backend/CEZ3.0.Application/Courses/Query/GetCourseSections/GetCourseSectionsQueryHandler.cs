using CEZ3._0.Application.Contracts.Responses.CourseSection;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Query.GetCourseSections;

public class GetCourseSectionsQueryHandler(
    ILogger<GetCourseSectionsQueryHandler> logger,
    ICourseRepository courseRepository,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<GetCourseSectionsQuery, IEnumerable<CourseSectionResponse>>
{
    public async Task<IEnumerable<CourseSectionResponse>> Handle(GetCourseSectionsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetCourseSectionsQuery for CourseId: {CourseId}", request.CourseId);

        if (!ObjectId.TryParse(request.CourseId, out var objectId))
            throw new BadRequestException("Invalid Course ID format.");

        var course = await courseRepository.GetByIdAsync(objectId);

        if (course is null)
            throw new NotFoundException($"Course with ID {request.CourseId} was not found.");

        var sections = await courseSectionRepository.GetCourseSectionsByCourseIdAsync(objectId);

        return sections.Select(s => new CourseSectionResponse
        {
            Id = s.Id.ToString(),
            CourseId = s.CourseId.ToString(),
            Title = s.Title,
            OrderIndex = s.OrderIndex,
            CreatedAt = s.CreatedAt,
            IsActive = s.IsActive,
            IsFinalized = s.IsFinalized
        });
    }
}