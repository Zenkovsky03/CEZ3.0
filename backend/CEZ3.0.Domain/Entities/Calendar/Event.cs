using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities.Calendar;

public class Event
{
    public ObjectId Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public ObjectId CreatedById { get; set; }
    public bool IsActive { get; set; }
    public virtual User CreatedBy { get; set; } = default!;
}
