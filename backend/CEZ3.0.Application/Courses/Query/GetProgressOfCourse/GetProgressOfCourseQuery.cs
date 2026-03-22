using CEZ3._0.Application.Courses.Dtos;
using MediatR;

namespace CEZ3._0.Application.Courses.Query.GetProgressOfCourse;

public class GetProgressOfCourseQuery : IRequest<ProgressDto>
{
    public string CourseId { get; set; } = string.Empty;
    public GetProgressOfCourseQuery(string courseId)
    {
        CourseId = courseId;
    }
}
