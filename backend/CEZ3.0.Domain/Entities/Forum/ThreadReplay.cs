using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities.Forum;

public class ThreadReplay
{
    public ObjectId Id { get; set; }
    public ObjectId ThreadId { get; set; }
    public string Content { get; set; } = default!;
    public ObjectId AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
