using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Command.FinalizedCourse;

public class FinalizedCourseSectionCommandHandler(ILogger<FinalizedCourseSectionCommandHandler> logger,
    IUserContext userContext,
    ICourseRepository courseRepository,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<FinalizedCourseSectionCommand, string>
{
    private readonly ILogger<FinalizedCourseSectionCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseRepository _courseRepository = courseRepository;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<string> Handle(FinalizedCourseSectionCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling FinalizedCourseSectionCommand for CourseSectionId: {CourseSectionId}", request.CourseSectionId);

        var user = _userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedException("User is not authenticated.");
        }

        var id = ObjectId.TryParse(request.CourseSectionId, out var sId) ? sId : throw new BadRequestException("Invalid CourseSectionId format.");

        var courseSection = await _courseSectionRepository.GetByIdAsync(id);

        if (courseSection == null)
            throw new BadRequestException("Course section not found.");

        var userId = ObjectId.TryParse(user.id, out var uId) ? uId : throw new BadRequestException("Invalid UserId format.");

        var course = await _courseRepository.GetByIdAsync(courseSection.CourseId);
        if (course == null)
            throw new BadRequestException("Course not found.");

        if (course.OwnerId != userId)
            throw new ForbiddenException("User does not have permission to finalize this course section.");

        courseSection.IsFinalized = true;
        await _courseSectionRepository.SaveChangesAsync();
        return courseSection.Id.ToString();
    }
}
