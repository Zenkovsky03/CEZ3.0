using CEZ3._0.Application.CourseSections.Dtos;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Query.GetCourseSectionForCourse;

public class GetCourseSectionForCourseQueryHandler(ILogger<GetCourseSectionForCourseQueryHandler> logger,
    IUserContext userContext,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<GetCourseSectionForCourseQuery, List<CourseSectionDto>>
{
    private readonly ILogger<GetCourseSectionForCourseQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<List<CourseSectionDto>> Handle(GetCourseSectionForCourseQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetCourseSectionForCourseQuery for CourseId: {CourseId}", request.CourseId);

        var user = _userContext.GetCurrentUser();

        if (user == null)
        {
            _logger.LogWarning("Unauthorized access attempt to GetCourseSectionByIdQuery");
            throw new UnauthorizedAccessException("User must be authenticated to access course section details.");
        }

        var id = ObjectId.TryParse(request.CourseId, out var objectId) ? objectId : throw new BadRequestException("Invalid CourseSectionId format.");

        var courseSections = await _courseSectionRepository.GetCourseSectionsByCourseIdAsync(id);

        var dtos = courseSections.Select(cs => new CourseSectionDto
        {
            Id = cs.Id,
            CourseId = cs.CourseId,
            Title = cs.Title,
            OrderIndex = cs.OrderIndex,
            CreatedAt = cs.CreatedAt,
            IsActive = cs.IsActive
        }).ToList();

        return dtos;
    }
}
