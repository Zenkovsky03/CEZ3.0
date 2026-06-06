namespace CEZ3._0.Application.Conversations.DTO;

public class ChatMessageDto
{
    public string Id { get; set; } = default!;
    public string ConversationId { get; set; } = default!;
    public string Body { get; set; } = default!;
    public DateTime SentAt { get; set; }
    public string SenderId { get; set; } = default!;
    public string SenderName { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}
