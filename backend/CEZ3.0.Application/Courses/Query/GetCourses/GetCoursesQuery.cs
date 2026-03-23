using CEZ3._0.Application.Courses.Dtos;
using MediatR;

namespace CEZ3._0.Application.Courses.Query.GetCourses;

public class GetCoursesQuery : IRequest<IEnumerable<CourseDto>> { }
