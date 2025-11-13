namespace CEZ3._0.Domain.Entities;

public class Task
{
    public int id { get; set; }
    public int course_id { get; set; }
    public Course Course { get; set; } = default!;
    public string title { get; set; } = default!;
    public string description { get; set; } = default!;
    public int max_point { get; set; }
    public long due_date { get; set; }
    public string task_type { get; set; } = default!;
    public int section_id { get; set; }
    public Course_Section Section { get; set; } = default!;
    public long created_at { get; set; }
    public Grade Grade { get; set; } = default!;
}
