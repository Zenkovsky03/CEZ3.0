using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CEZ3._0.Domain.Entities;

public class Grade
{
    [BsonId]
    public ObjectId Id { get; set; }
    public ObjectId AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = default!;
    public ObjectId UserId { get; set; }
    public User User { get; set; } = default!;
    public int PointsRecieved { get; set; }
    public string? Mark { get; set; }
    public string Feedback { get; set; } = default!;
    public ObjectId GradedById { get; set; }
    public User GradedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
