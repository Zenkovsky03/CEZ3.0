using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseEnrollments.Query.GetEnrollStudents;

public class GetEnrollStudentsQueryHandler(ILogger<GetEnrollStudentsQueryHandler> logger,
    IUserContext userContext,
    ICourseEnrollmentRepository courseEnrollmentRepository,
    IUserRepository userRepository) : IRequestHandler<GetEnrollStudentsQuery, List<UserDto>>
{
    private readonly ILogger<GetEnrollStudentsQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<List<UserDto>> Handle(GetEnrollStudentsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetEnrollStudentsQuery for CourseId");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        var ifTrue = ObjectId.TryParse(request.CourseId, out var parsedCourseId)
            ? parsedCourseId
            : throw new BadRequestException("Invalid CourseId format.");

        var enrolledStudents = await _courseEnrollmentRepository.GetEnrolledStudentsAsync(parsedCourseId);

        var ids = enrolledStudents.Select(e => e.UserId).ToList();

        var students = await _userRepository.GetUsersByIdsAsync(ids);

        var dtos = students.Select(s => new UserDto
        {
            Id = s.Id.ToString(),
            FirstName = s.FirstName,
            LastName = s.LastName,
            Username = s.Username,
            Email = s.Email,
            Role = s.Role,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt,
            IsBlocked = s.IsBlocked
        }).ToList();

        return dtos;
    }
}
