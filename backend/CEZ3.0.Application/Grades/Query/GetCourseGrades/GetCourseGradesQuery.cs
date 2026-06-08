using MediatR;

namespace CEZ3._0.Application.Grades.Query.GetCourseGrades;

public class GetCourseGradesQuery : IRequest<List<CourseGradeDto>>
{
    public string CourseId { get; set; } = string.Empty;
}

public class CourseGradeDto
{
    public string StudentId { get; set; } = string.Empty;
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public List<GradeEntryDto> Grades { get; set; } = new();
}

public class GradeEntryDto
{
    public string GradeId { get; set; } = string.Empty;
    public string AssignmentId { get; set; } = string.Empty;
    public string AssignmentTitle { get; set; } = string.Empty;
    public int PointsRecieved { get; set; }
    public int MaxPoints { get; set; }
    public string? Mark { get; set; }
    public string Feedback { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
