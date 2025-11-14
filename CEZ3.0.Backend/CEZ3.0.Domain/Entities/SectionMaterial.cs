namespace CEZ3._0.Domain.Entities;

public class SectionMaterial
{
    public Guid Id { get; set; }
    public Guid SectionId { get; set; }
    public CourseSection Section { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string MaterialType { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
