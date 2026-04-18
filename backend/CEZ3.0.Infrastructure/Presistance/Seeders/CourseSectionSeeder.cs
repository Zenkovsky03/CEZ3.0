using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var sections = new List<CourseSection>
        {
            // Course 1 — Mathematics
            new() { Id = SeedIds.Section1Course1, CourseId = SeedIds.Course1, Course = null!, Title = "Chapter 1: Algebra Basics",           OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            new() { Id = SeedIds.Section2Course1, CourseId = SeedIds.Course1, Course = null!, Title = "Chapter 2: Introduction to Geometry",  OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            new() { Id = SeedIds.Section3Course1, CourseId = SeedIds.Course1, Course = null!, Title = "Chapter 3: Basic Calculus Concepts",   OrderIndex = 3, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 2 — Polish Literature
            new() { Id = SeedIds.Section1Course2, CourseId = SeedIds.Course2, Course = null!, Title = "Unit 1: Romantic Era Overview",        OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            new() { Id = SeedIds.Section2Course2, CourseId = SeedIds.Course2, Course = null!, Title = "Unit 2: Positivism and Realism",       OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 3 — Computer Science
            new() { Id = SeedIds.Section1Course3, CourseId = SeedIds.Course3, Course = null!, Title = "Module 1: Programming Fundamentals",   OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            new() { Id = SeedIds.Section2Course3, CourseId = SeedIds.Course3, Course = null!, Title = "Module 2: Object-Oriented Design",     OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 4 — English
            new() { Id = SeedIds.Section1Course4, CourseId = SeedIds.Course4, Course = null!, Title = "Unit 1: Academic Writing Skills",      OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
        };

        await _db.CourseSections.AddRangeAsync(sections, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} course sections.", sections.Count);
    }
}