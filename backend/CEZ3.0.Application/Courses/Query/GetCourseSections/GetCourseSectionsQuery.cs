using CEZ3._0.Application.Contracts.Responses.CourseSection;
using MediatR;

namespace CEZ3._0.Application.Courses.Query.GetCourseSections;

public class GetCourseSectionsQuery : IRequest<IEnumerable<CourseSectionResponse>>
{
    public string CourseId { get; set; }

    public GetCourseSectionsQuery(string courseId)
    {
        CourseId = courseId;
    }
}