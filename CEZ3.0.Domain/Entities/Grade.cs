namespace CEZ3._0.Domain.Entities;

public class Grade
{
    public int id { get; set; }
    public int task_id { get; set; }
    public Task Task { get; set; } = default!;
    public int user_id { get; set; }
    public User User { get; set; } = default!;
    public int points_recieved { get; set; }
    public string? grade { get; set; }
    public string feedback { get; set; } = default!;
    public int graded_by_id { get; set; }
    public User Graded_by { get; set; } = default!;
    public long created_at { get; set; }
}
