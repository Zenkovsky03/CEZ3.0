using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Command.DeleteCourseSection;

public class DeleteCourseSectionCommandHandler(ILogger<DeleteCourseSectionCommandHandler> logger,
    IUserContext userContext,
    ICourseRepository courseRepository,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<DeleteCourseSectionCommand>
{
    private readonly ILogger<DeleteCourseSectionCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseRepository _courseRepository = courseRepository;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task Handle(DeleteCourseSectionCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CreateCourseSectionCommand");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to create section.");

        if (!ObjectId.TryParse(currentUser.id, out var userId))
            throw new UnauthorizedException("User must be logged in to create section.");

        if (!ObjectId.TryParse(request.CourseSectionId, out var courseSectionId))
            throw new BadRequestException("Course ID is invalid.");

        var courseSection = await _courseSectionRepository.GetByIdAsync(courseSectionId)
            ?? throw new BadRequestException("Course Section not found.");

        if (courseSection.IsActive == false)
            throw new BadRequestException("Course Section is already deleted.");

        var course = await _courseRepository.GetByIdAsync(courseSection.CourseId)
            ?? throw new BadRequestException("Course not found.");

        if (course.OwnerId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to create section without permission.",
                currentUser.id);
            throw new ForbiddenException("Only Owner can create section.");
        }

        courseSection.IsActive = false;
        courseSection.OrderIndex = -1;
        await _courseSectionRepository.SaveChangesAsync();
        await _courseSectionRepository.NormalizeOrderAsync(courseSection.CourseId);
    }
}
