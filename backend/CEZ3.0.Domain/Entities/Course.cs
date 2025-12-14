using MongoDB.Bson;

namespace CEZ3._0.Domain.Entities;

public class Course
{
    public ObjectId Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool Archived { get; set; }
    public ObjectId OwnerId { get; set; }
    public User Owner { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool IsPasswordProtected { get; set; }
    public string? PasswordHash { get; set; }
    //public CourseEnrollment CourseEnrollment { get; set; } = default!;
    //public CourseSection CourseSection { get; set; } = default!;
    //public ScheduleEntry ScheduleEntry { get; set; } = default!;
    //public Assignment Assignment { get; set; } = default!;
}
