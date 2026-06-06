namespace CEZ3._0.Application.Grades.Dtos;

public class GradeDto
{
    public string Id { get; set; } = string.Empty;
    public string AssignmentTitle { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public int PointsRecieved { get; set; }
    public int MaxPoints { get; set; }
    public string Mark { get; set; } = string.Empty;
    public string Feedback { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
