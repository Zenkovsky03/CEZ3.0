using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace CEZ3._0.Domain.Entities;

public class CourseSection
{
    [BsonId]
    public ObjectId Id { get; set; }
    public ObjectId CourseId { get; set; }
    public Course Course { get; set; } = default!;
    [MaxLength(70)]
    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsFinalized { get; set; }
    //public SectionMaterial SectionMaterial { get; set; } = default!;
    //public Assignment Assignment { get; set; } = default!;
}
