using CEZ3._0.Application.Users.Dtos;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Dtos;

public class ThreadDto
{
    public ObjectId Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public ObjectId AuthorId { get; set; }
    public UserDto Author { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool IsOpen { get; set; }
    public int TotalReplies { get; set; }
    public Helpers.PagedResult<ThreadReplayDto> Replies { get; set; } = default!;
}
