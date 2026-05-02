using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities.Forum;

public class Thread
{
    public ObjectId Id { get; set; }
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public ObjectId AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsOpen { get; set; }
    public bool IsActive { get; set; }
    public int TotalReplies { get; set; }
}
