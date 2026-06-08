using MongoDB.Bson;

namespace CEZ3._0.Application.Assignments.Dtos;

public class AssignmentDto
{
    public ObjectId Id { get; set; }
    public ObjectId SectionId { get; set; }
    public ObjectId CourseId { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int MaxPoint { get; set; }
    public DateTime? DueDate { get; set; }
    public string TaskType { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
