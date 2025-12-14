using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Query.IsUserEnroll;

public class IsUserEnrollQueryHandler(ILogger<IsUserEnrollQueryHandler> logger,
    IUserContext userContext,
    ICourseEnrollmentRepository courseEnrollmentRepository) : IRequestHandler<IsUserEnrollQuery, bool>
{
    private readonly ILogger<IsUserEnrollQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;

    public async Task<bool> Handle(IsUserEnrollQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Checking enrollment status for user in course with ID {CourseId}", request.CourseId);

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        if (currentUser.role != UserRoles.Student.ToString())
        {
            _logger.LogWarning("User {UserId} with role {Role} attempted to enrol in a course without permission.",
                currentUser.id, currentUser.role);

            throw new ForbiddenException("Only students can enrol in courses.");
        }

        ObjectId userId;

        if (!ObjectId.TryParse(currentUser.id, out userId))
        {
            _logger.LogWarning("Invalid user ID format: {UserId}", currentUser.id);
            throw new UnauthorizedException("Invalid user ID.");
        }

        var isEnrolled = await _courseEnrollmentRepository
            .IfStudentEnrolledAsync(request.CourseId, userId);

        return isEnrolled;
    }
}
