namespace CEZ3._0.Domain.Entities;

public class Grade
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public Task Task { get; set; } = default!;
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public int PointsRecieved { get; set; }
    public string? Mark { get; set; }
    public string Feedback { get; set; } = default!;
    public Guid GradedById { get; set; }
    public User GradedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
