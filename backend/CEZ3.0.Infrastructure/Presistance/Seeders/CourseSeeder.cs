using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class CourseSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<CourseSeeder> _logger;

    public int Order => 2;

    public CourseSeeder(CezDbContext db, ILogger<CourseSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        // Use AsNoTracking so the AnyAsync check doesn't leave anything in the tracker
        var anyExists = await _db.Courses.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Courses already seeded — skipping.");
            return;
        }

        // Clear anything else that leaked into the tracker from UserSeeder
        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var courses = new List<Course>
        {
            new()
            {
                Id                  = SeedIds.Course1,
                Name                = "Introduction to Mathematics",
                Description         = "Foundations of algebra, geometry and calculus for first-year students.",
                StartDate           = now.AddDays(-30),
                EndDate             = now.AddDays(150),
                Archived            = false,
                OwnerId             = SeedIds.Teacher1,
                Owner               = null!,
                CreatedAt           = now,
                IsPasswordProtected = false,
            },
            new()
            {
                Id                  = SeedIds.Course2,
                Name                = "Polish Literature & Composition",
                Description         = "Survey of Polish prose and poetry from the Romantic era to the present.",
                StartDate           = now.AddDays(-15),
                EndDate             = now.AddDays(165),
                Archived            = false,
                OwnerId             = SeedIds.Teacher2,
                Owner               = null!,
                CreatedAt           = now,
                IsPasswordProtected = false,
            },
        };

        await _db.Courses.AddRangeAsync(courses, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} courses.", courses.Count);
    }
}