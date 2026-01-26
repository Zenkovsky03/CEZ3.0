using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities;

public class SectionMaterial
{
    public ObjectId Id { get; set; }
    public ObjectId SectionId { get; set; }
    public CourseSection Section { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string MaterialType { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
