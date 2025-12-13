using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CEZ3._0.Domain.Entities;


public class CourseEnrollment
{
    [BsonId]
    public ObjectId Id { get; set; }
    public ObjectId CourseId { get; set; }
    public ObjectId UserId { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public bool IsActive { get; set; }
}
