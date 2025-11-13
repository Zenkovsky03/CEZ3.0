namespace CEZ3._0.Domain.Entities;

public class Course
{
    public int id { get; set; }
    public string name { get; set; } = default!;
    public string description { get; set; } = default!;
    public DateTime start_date { get; set; }
    public DateTime end_date { get; set; }
    public bool archived { get; set; }
    public int owner_id { get; set; }
    public User Owner { get; set; } = default!;
    public long created_at { get; set; }
    public Course_Enrollment Course_Enrollment { get; set; } = default!;
    public Course_Section Course_Section { get; set; } = default!;
    public Schedule_Entry Schedule_Entry { get; set; } = default!;
    public Task Task { get; set; } = default!;
}
