using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities.Calendar;

public class Announcement
{
    public ObjectId Id { get; set; }
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
    public ObjectId CreatedById { get; set; }
    public virtual User CreatedBy { get; set; } = default!;
}
