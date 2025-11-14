namespace CEZ3._0.Domain.Entities;

public class ScheduleEntry
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = default!;
    public string Title { get; set; } = default!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Location { get; set; } = default!;
    public string EntryType { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
