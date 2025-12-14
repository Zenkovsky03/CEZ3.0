using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Command.AssignTeacher;

public class AssignTeacherCommand : IRequest
{
    public ObjectId CourseId { get; set; }
    public ObjectId TeacherId { get; set; }

    public AssignTeacherCommand()
    {
    }

    public AssignTeacherCommand(ObjectId courseId, ObjectId teacherId)
    {
        CourseId = courseId;
        TeacherId = teacherId;
    }
}
