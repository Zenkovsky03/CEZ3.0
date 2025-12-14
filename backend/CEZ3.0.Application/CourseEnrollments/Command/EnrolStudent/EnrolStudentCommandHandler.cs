using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseEnrollments.Command.EnrolStudent;

public class EnrolStudentCommandHandler(ILogger<EnrolStudentCommandHandler> logger,
    IUserContext userContext,
    ICourseEnrollmentRepository courseEnrollmentRepository,
    ICourseRepository courseRepository) : IRequestHandler<EnrolStudentCommand>
{
    private readonly ILogger<EnrolStudentCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;
    private readonly ICourseRepository _courseRepository = courseRepository;

    public async Task Handle(EnrolStudentCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Enrolling student in course with ID {CourseId}", request.CourseId);

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        if (currentUser.role != UserRoles.Student.ToString())
        {
            _logger.LogWarning("User {UserId} with role {Role} attempted to enrol in a course without permission.",
                currentUser.id, currentUser.role);

            throw new ForbiddenException("Only students can enrol in courses.");
        }

        var course = await _courseRepository.GetByIdAsync(request.CourseId);
        if (course == null)
        {
            _logger.LogWarning("User {UserId} attempted to enrol in non-existent course {CourseId}.",
                currentUser.id, request.CourseId);
            throw new BadRequestException("The specified course does not exist.");
        }

        if (course.IsPasswordProtected)
        {
            if (string.IsNullOrEmpty(request.Password))
            {
                _logger.LogWarning("User {UserId} attempted to enrol in password-protected course {CourseId} without providing a password.",
                    currentUser.id, request.CourseId);
                throw new BadRequestException("Password is required to enrol in this course.");
            }
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, course.PasswordHash!);
            if (!isPasswordValid)
            {
                _logger.LogWarning("User {UserId} provided an incorrect password when attempting to enrol in course {CourseId}.",
                    currentUser.id, request.CourseId);
                throw new BadRequestException("Incorrect password for the specified course.");
            }
        }

        CourseEnrollment? existingEnrollment;
        existingEnrollment = await _courseEnrollmentRepository.IsStudentEnrolledAsync(request.CourseId, new ObjectId(currentUser.id));
        if (existingEnrollment != null)
        {
            if (existingEnrollment.IsActive)
            {
                _logger.LogWarning("User {UserId} attempted to enrol in course {CourseId} but is already enrolled.",
                    currentUser.id, request.CourseId);
                throw new BadRequestException("Student is already enrolled in the specified course.");
            }

            existingEnrollment.IsActive = true;
            existingEnrollment.EnrollmentDate = DateTime.UtcNow;

            await _courseEnrollmentRepository.SaveChangesAsync();
        }
        else
        {
            CourseEnrollment courseEnrollment = new CourseEnrollment
            {
                CourseId = request.CourseId,
                UserId = new ObjectId(currentUser.id),
                EnrollmentDate = DateTime.UtcNow,
                IsActive = true
            };

            await _courseEnrollmentRepository.EnrolStudentAsync(courseEnrollment);
        }
    }
}
