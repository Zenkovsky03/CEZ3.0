using CEZ3._0.Application.Contracts.Responses.Courses;
using MediatR;

namespace CEZ3._0.Application.Courses.Query.GetCourseById;

public class GetCourseByIdQuery : IRequest<CourseResponse>
{
    public string Id { get; set; }

    public GetCourseByIdQuery(string id)
    {
        Id = id;
    }
}