using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Dtos;

public class ThreadReplayDto
{
    public ObjectId Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public ObjectId AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
