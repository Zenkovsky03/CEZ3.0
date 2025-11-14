namespace CEZ3._0.Domain.Entities;

public class Message
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = default!;
    public int RecipientId { get; set; }
    public User Recipient { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
    public bool IsRead { get; set; } = false;
    public DateTime SentAt { get; set; }
}
