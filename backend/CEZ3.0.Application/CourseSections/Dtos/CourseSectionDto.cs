using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Dtos;

public class CourseSectionDto
{
    public ObjectId Id { get; set; }
    public ObjectId CourseId { get; set; }
    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
