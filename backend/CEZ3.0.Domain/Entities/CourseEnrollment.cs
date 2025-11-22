namespace CEZ3._0.Domain.Entities;

public class CourseEnrollment
{
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = default!;
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public DateTime EnrollmentDate { get; set; }
    public bool IsActive { get; set; }
}
