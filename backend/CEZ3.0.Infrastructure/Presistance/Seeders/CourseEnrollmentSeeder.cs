using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        // Course1 & Course2 → all 10 students
        // Course3 → students 1-7
        // Course4 → students 4-10
        var enrollmentMap = new (ObjectId CourseId, ObjectId[] Students)[]
        {
            (SeedIds.Course1, new[] { SeedIds.Student1,SeedIds.Student2,SeedIds.Student3,SeedIds.Student4,SeedIds.Student5,SeedIds.Student6,SeedIds.Student7,SeedIds.Student8,SeedIds.Student9,SeedIds.Student10 }),
            (SeedIds.Course2, new[] { SeedIds.Student1,SeedIds.Student2,SeedIds.Student3,SeedIds.Student4,SeedIds.Student5,SeedIds.Student6,SeedIds.Student7,SeedIds.Student8,SeedIds.Student9,SeedIds.Student10 }),
            (SeedIds.Course3, new[] { SeedIds.Student1,SeedIds.Student2,SeedIds.Student3,SeedIds.Student4,SeedIds.Student5,SeedIds.Student6,SeedIds.Student7 }),
            (SeedIds.Course4, new[] { SeedIds.Student4,SeedIds.Student5,SeedIds.Student6,SeedIds.Student7,SeedIds.Student8,SeedIds.Student9,SeedIds.Student10 }),
        };

        var enrollments = new List<CourseEnrollment>();
        foreach (var (courseId, students) in enrollmentMap)
            foreach (var studentId in students)
                enrollments.Add(new CourseEnrollment
                {
                    Id             = ObjectId.GenerateNewId(),
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