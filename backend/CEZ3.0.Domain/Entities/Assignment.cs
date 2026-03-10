using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CEZ3._0.Domain.Entities;

public class Assignment
{
    [BsonId]
    public ObjectId Id { get; set; }
    public ObjectId CourseId { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int MaxPoint { get; set; }
    public DateTime DueDate { get; set; }
    public string TaskType { get; set; } = default!; // "Quiz" lub "Test"
    public bool IsAutoGraded { get; set; } // Czy automatycznie wystawić ocenę
    public List<QuizQuestion> Questions { get; set; } = new(); 
    public ObjectId SectionId { get; set; }
    public DateTime CreatedAt { get; set; }
}


