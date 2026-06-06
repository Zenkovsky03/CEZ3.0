using CEZ3._0.Application.Grades.Dtos;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Grades.Query.GetMyGrades;

public class GetMyGradesQueryHandler(ILogger<GetMyGradesQueryHandler> logger,
    IUserContext userContext,
    IGradeRepository gradeRepository,
    IAssignmentRepository assignmentRepository,
    ICourseRepository courseRepository) : IRequestHandler<GetMyGradesQuery, List<GradeDto>>
{
    public async Task<List<GradeDto>> Handle(GetMyGradesQuery request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

        var userId = ObjectId.Parse(currentUser.id);

        var grades = await gradeRepository.GetByUserIdAsync(userId);

        if (grades == null || !grades.Any())
            return new List<GradeDto>();

        var dto = new List<GradeDto>();
        foreach (var grade in grades)
        {
            var assignment = await assignmentRepository.GetByIdAsync(grade.AssignmentId);
            var course = assignment != null
                ? await courseRepository.GetByIdAsync(assignment.CourseId)
                : null;

            if (request.CourseId != null && (course == null || course.Id.ToString() != request.CourseId))
                continue;

            dto.Add(new GradeDto
            {
                Id = grade.Id.ToString(),
                AssignmentTitle = assignment?.Title ?? "Unknown Assignment",
                CourseName = course?.Name ?? "Unknown Course",
                PointsRecieved = grade.PointsRecieved,
                MaxPoints = assignment?.MaxPoint ?? 0,
                Mark = grade.Mark ?? "",
                Feedback = grade.Feedback ?? "",
                CreatedAt = grade.CreatedAt
            });
        }

        return dto;
    }
}
