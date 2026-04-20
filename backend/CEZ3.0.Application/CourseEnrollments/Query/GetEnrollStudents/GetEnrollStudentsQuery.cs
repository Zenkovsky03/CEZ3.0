using CEZ3._0.Application.Users.Dtos;
using MediatR;

namespace CEZ3._0.Application.CourseEnrollments.Query.GetEnrollStudents;

public class GetEnrollStudentsQuery : IRequest<List<UserDto>>
{
    public string CourseId { get; set; } = string.Empty;

    public GetEnrollStudentsQuery(string courseId)
    {
        CourseId = courseId;
    }
}
