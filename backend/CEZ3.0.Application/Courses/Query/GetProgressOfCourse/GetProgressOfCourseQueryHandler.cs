using CEZ3._0.Application.Courses.Dtos;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Query.GetProgressOfCourse;

public class GetProgressOfCourseQueryHandler(ILogger<GetProgressOfCourseQueryHandler> logger,
    IUserContext userContext,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<GetProgressOfCourseQuery, ProgressDto>
{
    private readonly ILogger<GetProgressOfCourseQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<ProgressDto> Handle(GetProgressOfCourseQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetProgressOfCourseQuery for CourseId: {CourseId}", request.CourseId);

        var user = _userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedException("User is not authenticated.");
        }

        var id = ObjectId.TryParse(request.CourseId, out var sId) ? sId : throw new BadRequestException("Invalid CourseSectionId format.");

        var sections = await _courseSectionRepository.GetNumberOfAllSectionsAsync(id);
        var completedSections = await _courseSectionRepository.GetNumberOfCompletedSectionsAsync(id);

        var progress = new ProgressDto
        {
            TotalSections = sections,
            CompletedSections = completedSections
        };

        return progress;
    }
}
