namespace CEZ3._0.Domain.Entities;

public class Task
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int MaxPoint { get; set; }
    public DateTime DueDate { get; set; }
    public string TaskType { get; set; } = default!;
    public Guid SectionId { get; set; }
    public CourseSection Section { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public Grade Grade { get; set; } = default!;
}
