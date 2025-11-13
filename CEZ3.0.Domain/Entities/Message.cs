namespace CEZ3._0.Domain.Entities;

public class Message
{
    public int id { get; set; }
    public int sender_id { get; set; }
    public User Sender { get; set; } = default!;
    public int recipient_id { get; set; }
    public User Recipient { get; set; } = default!;
    public string subject { get; set; } = default!;
    public string body { get; set; } = default!;
    public bool is_read { get; set; } = false;
    public long sent_at { get; set; }
}
