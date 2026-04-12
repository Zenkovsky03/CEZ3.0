using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeds sections for both courses.
/// Order 4 — requires Courses.
/// Title is capped at 70 chars to respect the MaxLength constraint on CourseSection.Title.
/// </summary>
public class CourseSectionSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<CourseSectionSeeder> _logger;

    public int Order => 4;

    public CourseSectionSeeder(CezDbContext db, ILogger<CourseSectionSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.CourseSections.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("CourseSections already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts from navigation properties tracked in earlier seeders.
        _db.ChangeTracker.Clear();

        var sections = new List<CourseSection>
        {
            // Course 1 sections
            new()
            {
                Id          = SeedIds.Section1Course1,
                CourseId    = SeedIds.Course1,
                Title       = "Chapter 1: Algebra Basics",        // ≤ 70 chars ✓
                OrderIndex  = 1,
                CreatedAt   = now,
                IsActive    = true,
                IsFinalized = true,
            },
            new()
            {
                Id          = SeedIds.Section2Course1,
                CourseId    = SeedIds.Course1,
                Title       = "Chapter 2: Introduction to Geometry",
                OrderIndex  = 2,
                CreatedAt   = now,
                IsActive    = true,
                IsFinalized = false,
            },

            // Course 2 section
            new()
            {
                Id          = SeedIds.Section1Course2,
                CourseId    = SeedIds.Course2,
                Title       = "Unit 1: Romantic Era Overview",
                OrderIndex  = 1,
                CreatedAt   = now,
                IsActive    = true,
                IsFinalized = true,
            },
        };

        await _db.CourseSections.AddRangeAsync(sections, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} course sections.", sections.Count);
    }
}