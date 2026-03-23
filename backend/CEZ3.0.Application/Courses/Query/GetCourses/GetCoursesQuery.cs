using CEZ3._0.Application.Contracts.Responses.Courses;
using MediatR;

namespace CEZ3._0.Application.Courses.Query.GetCourses;

public class GetCoursesQuery : IRequest<IEnumerable<CourseResponse>>
{
}