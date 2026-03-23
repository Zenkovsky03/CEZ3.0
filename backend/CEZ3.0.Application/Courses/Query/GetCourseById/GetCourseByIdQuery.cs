using CEZ3._0.Application.Courses.Dtos;
using MediatR;

namespace CEZ3._0.Application.Courses.Query.GetCourseById;

public class GetCourseByIdQuery(string id) : IRequest<CourseDto>
{
    public string Id { get; } = id;
}
