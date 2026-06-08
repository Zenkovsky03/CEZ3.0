using CEZ3._0.Application.Assignments.Dtos;
using MediatR;

namespace CEZ3._0.Application.Assignments.Query.GetAssignmentsByCourse;

public class GetAssignmentsByCourseQuery : IRequest<List<AssignmentDto>>
{
    public string CourseId { get; set; }

    public GetAssignmentsByCourseQuery(string courseId)
    {
        CourseId = courseId;
    }
}
