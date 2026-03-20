using CEZ3._0.Application.CourseSections.Dtos;
using MediatR;

namespace CEZ3._0.Application.CourseSections.Query.GetCourseSectionForCourse;

public class GetCourseSectionForCourseQuery : IRequest<List<CourseSectionDto>>
{
    public string CourseId { get; set; } = string.Empty;

    public GetCourseSectionForCourseQuery(string courseId)
    {
        CourseId = courseId;
    }
}
