using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseEnrollments.Command.UnenrollStudent;

public class UnenrollStudentCommand : IRequest
{
    public ObjectId CourseId { get; set; }

    public UnenrollStudentCommand(ObjectId courseId)
    {
        CourseId = courseId;
    }
}
