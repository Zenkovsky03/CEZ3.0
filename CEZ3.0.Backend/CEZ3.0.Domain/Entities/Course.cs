namespace CEZ3._0.Domain.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool Archived { get; set; }
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public CourseEnrollment CourseEnrollment { get; set; } = default!;
    public CourseSection CourseSection { get; set; } = default!;
    public ScheduleEntry ScheduleEntry { get; set; } = default!;
    public Task Task { get; set; } = default!;
}
