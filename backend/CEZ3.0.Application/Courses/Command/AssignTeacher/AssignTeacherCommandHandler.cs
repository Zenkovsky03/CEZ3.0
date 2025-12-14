using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Courses.Command.AssignTeacher;

public class AssignTeacherCommandHandler(ILogger<AssignTeacherCommandHandler> logger,
    IUserContext userContext,
    ICourseRepository courseRepository,
    IUserRepository userRepository) : IRequestHandler<AssignTeacherCommand>
{
    private readonly ILogger<AssignTeacherCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseRepository _courseRepository = courseRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task Handle(AssignTeacherCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling AssignTeacherCommand for CourseId: {CourseId} and TeacherId: {TeacherId}",
            request.CourseId, request.TeacherId);

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to assign teacher to course.");

        if (currentUser.role != UserRoles.Admin.ToString())
        {
            _logger.LogWarning("User {UserId} with role {Role} attempted to assign teacher to course without permission.",
                currentUser.id, currentUser.role);
            throw new ForbiddenException("Only Admin can assign teacher to courses.");
        }

        var course = await _courseRepository.GetByIdAsync(request.CourseId);
        if (course == null)
        {
            _logger.LogWarning("Course with ID {CourseId} not found.", request.CourseId);
            throw new BadRequestException("Course not found.");
        }

        var teacher = await _userRepository.GetByIdAsync(request.TeacherId);
        if (teacher == null || teacher.Role != UserRoles.Teacher.ToString())
        {
            _logger.LogWarning("Teacher with ID {TeacherId} not found.", request.TeacherId);
            throw new BadRequestException("Teacher not found.");
        }

        course.OwnerId = request.TeacherId;
        await _courseRepository.SaveChangesAsync();
    }
}
