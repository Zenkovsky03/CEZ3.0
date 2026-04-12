using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// Enrols all 5 students into both courses.
/// Order 3 — requires Users + Courses.
/// </summary>
public class CourseEnrollmentSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<CourseEnrollmentSeeder> _logger;

    public int Order => 3;

    public CourseEnrollmentSeeder(CezDbContext db, ILogger<CourseEnrollmentSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.CourseEnrollments.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("CourseEnrollments already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts from navigation properties tracked in earlier seeders.
        _db.ChangeTracker.Clear();
        var studentIds = new[]
        {
            SeedIds.Student1, SeedIds.Student2, SeedIds.Student3,
            SeedIds.Student4, SeedIds.Student5
        };
        var courseIds = new[] { SeedIds.Course1, SeedIds.Course2 };

        var enrollments = new List<CourseEnrollment>();

        foreach (var courseId in courseIds)
            foreach (var studentId in studentIds)
                enrollments.Add(new CourseEnrollment
                {
                    Id             = MongoDB.Bson.ObjectId.GenerateNewId(),
                    CourseId       = courseId,
                    UserId         = studentId,
                    EnrollmentDate = now,
                    IsActive       = true,
                });

        await _db.CourseEnrollments.AddRangeAsync(enrollments, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} course enrollments.", enrollments.Count);
    }
}