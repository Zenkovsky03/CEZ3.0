using MediatR;

namespace CEZ3._0.Application.Courses.Command.AssignTeacher;

public class AssignTeacherCommand : IRequest
{
    public string CourseId { get; set; } = string.Empty;
    public string TeacherId { get; set; } = string.Empty;

    public AssignTeacherCommand()
    {
    }

    public AssignTeacherCommand(string courseId, string teacherId)
    {
        CourseId = courseId;
        TeacherId = teacherId;
    }
}