using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Command.CreateCourseSection;

public class CreateCourseSectionCommandHandler(ILogger<CreateCourseSectionCommandHandler> logger,
    IUserContext userContext,
    ICourseRepository courseRepository,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<CreateCourseSectionCommand, string>
{
    private readonly ILogger<CreateCourseSectionCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseRepository _courseRepository = courseRepository;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<string> Handle(CreateCourseSectionCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CreateCourseSectionCommand");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to create section.");

        if (!ObjectId.TryParse(currentUser.id, out var userId))
            throw new UnauthorizedException("User must be logged in to create section.");

        if (currentUser.role != UserRoles.Teacher.ToString() && currentUser.role != UserRoles.Admin.ToString())
        {
            _logger.LogWarning("User {UserId} with role {Role} attempted to create section without permission.",
                currentUser.id, currentUser.role);
            throw new ForbiddenException("Only Owner can create section.");
        }

        if (!ObjectId.TryParse(request.CourseId, out var courseId))
            throw new BadRequestException("Course ID is invalid.");

        var course = await _courseRepository.GetByIdAsync(courseId)
            ?? throw new BadRequestException("Course not found.");

        if (course.OwnerId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to create section without permission.",
                currentUser.id);
            throw new ForbiddenException("Only Owner can create section.");
        }

        if (request.Title.Length < 3 || request.Title.Length > 70)
        {
            _logger.LogWarning("User {UserId} provided invalid section title length: {TitleLength}.",
                currentUser.id, request.Title.Length);
            throw new BadRequestException("Section title must be between 3 and 70 characters.");
        }

        CourseSection section = new CourseSection
        {
            Id = ObjectId.GenerateNewId(),
            Title = request.Title,
            CreatedAt = DateTime.UtcNow,
            CourseId = courseId,
            OrderIndex = request.OrderIndex,
            IsActive = true,
            IsFinalized = false
        };

        await _courseSectionRepository.AddSectionAsync(section);
        await _courseSectionRepository.NormalizeOrderAsync(courseId);

        return section.Id.ToString();
    }
}
