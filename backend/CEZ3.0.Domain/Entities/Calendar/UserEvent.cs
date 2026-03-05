using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CEZ3._0.Domain.Entities.Calendar;

public class UserEvent
{
    [BsonId]
    public ObjectId Id { get; set; }
    public ObjectId UserId { get; set; }
    public virtual User User { get; set; } = default!;
    public ObjectId EventId { get; set; }
    public virtual Event Event { get; set; } = default!;
}
