using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Command.EditCourseSection;

public class EditCourseSectionCommandHandler(ILogger<EditCourseSectionCommandHandler> logger,
    IUserContext userContext,
    ICourseRepository courseRepository,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<EditCourseSectionCommand, string>
{
    private readonly ILogger<EditCourseSectionCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseRepository _courseRepository = courseRepository;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<string> Handle(EditCourseSectionCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CreateCourseSectionCommand");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to edit section.");

        if (!ObjectId.TryParse(currentUser.id, out var userId))
            throw new UnauthorizedException("User must be logged in to edit section.");

        if (!ObjectId.TryParse(request.CourseSectionId, out var courseSectionId))
            throw new BadRequestException("Course ID is invalid.");

        var courseSection = await _courseSectionRepository.GetByIdAsync(courseSectionId)
             ?? throw new BadRequestException("Course Section not found.");

        var course = await _courseRepository.GetByIdAsync(courseSection.CourseId)
            ?? throw new BadRequestException("Course not found.");

        if (course.OwnerId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to edit section without permission.",
                currentUser.id);
            throw new ForbiddenException("Only Owner can edit section.");
        }

        if (request.Title.Length < 3 || request.Title.Length > 70)
        {
            _logger.LogWarning("User {UserId} provided invalid section title length: {TitleLength}.",
                currentUser.id, request.Title.Length);
            throw new BadRequestException("Section title must be between 3 and 70 characters.");
        }

        courseSection.Title = request.Title;
        courseSection.OrderIndex = request.OrderIndex;

        await _courseSectionRepository.SaveChangesAsync();
        await _courseSectionRepository.NormalizeOrderAsync(courseSection.CourseId);

        return courseSection.Id.ToString();
    }
}
