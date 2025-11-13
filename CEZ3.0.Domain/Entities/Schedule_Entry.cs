namespace CEZ3._0.Domain.Entities;

public class Schedule_Entry
{
    public int id { get; set; }
    public int course_id { get; set; }
    public Course Course { get; set; } = default!;
    public string title { get; set; } = default!;
    public long start_time { get; set; }
    public long end_time { get; set; }
    public string location { get; set; } = default!;
    public string entry_type { get; set; } = default!;
    public long created_at { get; set; }
}
