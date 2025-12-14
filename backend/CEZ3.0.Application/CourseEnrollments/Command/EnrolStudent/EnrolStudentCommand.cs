using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseEnrollments.Command.EnrolStudent;

public class EnrolStudentCommand : IRequest
{
    public ObjectId CourseId { get; set; } = default!;
    public string? Password { get; set; }

    public EnrolStudentCommand(ObjectId courseId, string? password)
    {
        CourseId = courseId;
        Password = password;
    }
}
