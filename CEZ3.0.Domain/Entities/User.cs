namespace CEZ3._0.Domain.Entities;

public class User
{
    public int id { get; set; }
    public string username { get; set; } = default!;
    public string email { get; set; } = default!;
    public string password_hash { get; set; } = default!;
    public string role { get; set; } = default!;
    public bool is_active { get; set; }
    public long created_at { get; set; }
    public Course course { get; set; } = default!;
    public Course_Enrollment Course_Enrollment { get; set; } = default!;
    public Grade Student { get; set; } = default!;
    public Grade Grader { get; set; } = default!;
    public Message Sender { get; set; } = default!;
    public Message Recipient { get; set; } = default!;
}
