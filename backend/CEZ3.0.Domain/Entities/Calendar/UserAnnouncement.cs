using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities.Calendar;

public class UserAnnouncement 
{
    public ObjectId Id { get; set; }
    public ObjectId UserId { get; set; }
    public virtual User User { get; set; } = default!;
    public ObjectId AnnouncementId { get; set; }
    public virtual Announcement Announcement { get; set; } = default!;
}
