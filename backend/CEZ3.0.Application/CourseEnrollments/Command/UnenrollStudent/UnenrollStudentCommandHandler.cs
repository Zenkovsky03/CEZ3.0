using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.CourseEnrollments.Command.UnenrollStudent;

public class UnenrollStudentCommandHandler(ILogger<UnenrollStudentCommandHandler> logger,
    IUserContext userContext,
    ICourseEnrollmentRepository courseEnrollmentRepository) : IRequestHandler<UnenrollStudentCommand>
{
    private readonly ILogger<UnenrollStudentCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;

    public async Task Handle(UnenrollStudentCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Unenrolling student from course with ID {CourseId}", request.CourseId);

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        var enrollment = await _courseEnrollmentRepository.GetStudentEnrollmentAsync(request.CourseId, new MongoDB.Bson.ObjectId(currentUser.id));

        if (enrollment == null)
        {
            throw new BadRequestException("Student is not enrolled in the specified course.");
        }

        enrollment.IsActive = false;
        await _courseEnrollmentRepository.SaveChangesAsync();
    }
}
