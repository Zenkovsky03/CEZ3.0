namespace CEZ3._0.Domain.Entities;

public class CourseSection
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = default!;
    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; }
    public SectionMaterial SectionMaterial { get; set; } = default!;
    public Task Task { get; set; } = default!;
}
