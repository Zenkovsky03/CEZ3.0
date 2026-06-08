using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Grades.Query.GetCourseGrades;

public class GetCourseGradesQueryHandler(
    ILogger<GetCourseGradesQueryHandler> logger,
    IUserContext userContext,
    IGradeRepository gradeRepository,
    IAssignmentRepository assignmentRepository,
    ICourseRepository courseRepository,
    ICourseEnrollmentRepository enrollmentRepository,
    IUserRepository userRepository) : IRequestHandler<GetCourseGradesQuery, List<CourseGradeDto>>
{
    public async Task<List<CourseGradeDto>> Handle(GetCourseGradesQuery request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

        if (currentUser.role != UserRoles.Teacher.ToString() && currentUser.role != UserRoles.Admin.ToString())
            throw new ForbiddenException("Only teachers and admins can view course grades.");

        if (!ObjectId.TryParse(request.CourseId, out var courseId))
            throw new BadRequestException("Invalid course ID.");

        var course = await courseRepository.GetByIdAsync(courseId)
            ?? throw new BadRequestException("Course not found.");

        var assignments = (await assignmentRepository.GetByCourseIdAsync(courseId)).ToList();
        var assignmentIds = assignments.Select(a => a.Id).ToList();

        var allGrades = assignmentIds.Count > 0
            ? await gradeRepository.GetByAssignmentIdsAsync(assignmentIds)
            : new List<Domain.Entities.Grade>();

        var enrolledStudents = await enrollmentRepository.GetEnrolledStudentsAsync(courseId);
        var studentIds = enrolledStudents.Select(e => e.UserId).ToList();
        var students = await userRepository.GetUsersByIdsAsync(studentIds);
        var studentMap = students.ToDictionary(s => s.Id, s => s);

        var gradesByStudent = allGrades
            .Where(g => studentIds.Contains(g.UserId))
            .GroupBy(g => g.UserId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var result = new List<CourseGradeDto>();
        foreach (var studentId in studentIds)
        {
            var student = studentMap.GetValueOrDefault(studentId);
            var studentGrades = gradesByStudent.GetValueOrDefault(studentId, new List<Domain.Entities.Grade>());

            var assignmentMap = assignments.ToDictionary(a => a.Id, a => a);

            result.Add(new CourseGradeDto
            {
                StudentId = studentId.ToString(),
                StudentFirstName = student?.FirstName ?? "",
                StudentLastName = student?.LastName ?? "",
                StudentEmail = student?.Email ?? "",
                Grades = studentGrades.Select(g =>
                {
                    var assignment = assignmentMap.GetValueOrDefault(g.AssignmentId);
                    return new GradeEntryDto
                    {
                        GradeId = g.Id.ToString(),
                        AssignmentId = g.AssignmentId.ToString(),
                        AssignmentTitle = assignment?.Title ?? "Unknown",
                        PointsRecieved = g.PointsRecieved,
                        MaxPoints = assignment?.MaxPoint ?? 0,
                        Mark = g.Mark ?? "",
                        Feedback = g.Feedback ?? "",
                        CreatedAt = g.CreatedAt
                    };
                }).ToList()
            });
        }

        return result;
    }
}
