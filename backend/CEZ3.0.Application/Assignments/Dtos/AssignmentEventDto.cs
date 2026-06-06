using MongoDB.Bson;

namespace CEZ3._0.Application.Assignments.Dtos;

public class AssignmentEventDto
{
    public ObjectId Id { get; set; }
    public string CourseSectionTitle { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string TaskType { get; set; } = string.Empty; // "Quiz" lub "Test"
}
