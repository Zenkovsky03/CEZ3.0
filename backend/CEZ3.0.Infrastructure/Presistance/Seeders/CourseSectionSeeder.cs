using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

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
        _db.ChangeTracker.Clear();
        var now = DateTime.UtcNow;

        var allDesired = new Dictionary<ObjectId, CourseSection>
        {
            // Course 1 — Mathematics
            [SeedIds.Section1Course1] = new() { Id = SeedIds.Section1Course1, CourseId = SeedIds.Course1, Course = null!, Title = "Chapter 1: Algebra Basics",           OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section2Course1] = new() { Id = SeedIds.Section2Course1, CourseId = SeedIds.Course1, Course = null!, Title = "Chapter 2: Introduction to Geometry",  OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section3Course1] = new() { Id = SeedIds.Section3Course1, CourseId = SeedIds.Course1, Course = null!, Title = "Chapter 3: Basic Calculus Concepts",   OrderIndex = 3, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 2 — Polish Literature
            [SeedIds.Section1Course2] = new() { Id = SeedIds.Section1Course2, CourseId = SeedIds.Course2, Course = null!, Title = "Unit 1: Romantic Era Overview",        OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section2Course2] = new() { Id = SeedIds.Section2Course2, CourseId = SeedIds.Course2, Course = null!, Title = "Unit 2: Positivism and Realism",       OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 3 — Computer Science
            [SeedIds.Section1Course3] = new() { Id = SeedIds.Section1Course3, CourseId = SeedIds.Course3, Course = null!, Title = "Module 1: Programming Fundamentals",   OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section2Course3] = new() { Id = SeedIds.Section2Course3, CourseId = SeedIds.Course3, Course = null!, Title = "Module 2: Object-Oriented Design",     OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 4 — English
            [SeedIds.Section1Course4] = new() { Id = SeedIds.Section1Course4, CourseId = SeedIds.Course4, Course = null!, Title = "Unit 1: Academic Writing Skills",      OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section2Course4] = new() { Id = SeedIds.Section2Course4, CourseId = SeedIds.Course4, Course = null!, Title = "Unit 2: Research and Citation",        OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section3Course4] = new() { Id = SeedIds.Section3Course4, CourseId = SeedIds.Course4, Course = null!, Title = "Unit 3: Persuasive Writing",           OrderIndex = 3, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 5 — Physics
            [SeedIds.Section1Course5] = new() { Id = SeedIds.Section1Course5, CourseId = SeedIds.Course5, Course = null!, Title = "Rozdział 1: Mechanika klasyczna",      OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section2Course5] = new() { Id = SeedIds.Section2Course5, CourseId = SeedIds.Course5, Course = null!, Title = "Rozdział 2: Termodynamika",            OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section3Course5] = new() { Id = SeedIds.Section3Course5, CourseId = SeedIds.Course5, Course = null!, Title = "Rozdział 3: Optyka",                  OrderIndex = 3, CreatedAt = now, IsActive = true,  IsFinalized = false },

            // Course 6 — Biology
            [SeedIds.Section1Course6] = new() { Id = SeedIds.Section1Course6, CourseId = SeedIds.Course6, Course = null!, Title = "Rozdział 1: Biologia komórki",         OrderIndex = 1, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section2Course6] = new() { Id = SeedIds.Section2Course6, CourseId = SeedIds.Course6, Course = null!, Title = "Rozdział 2: Genetyka",                OrderIndex = 2, CreatedAt = now, IsActive = true,  IsFinalized = true  },
            [SeedIds.Section3Course6] = new() { Id = SeedIds.Section3Course6, CourseId = SeedIds.Course6, Course = null!, Title = "Rozdział 3: Ekologia",                OrderIndex = 3, CreatedAt = now, IsActive = true,  IsFinalized = false },
        };

        var existingIds = await _db.CourseSections.AsNoTracking().Select(s => s.Id).ToListAsync(cancellationToken);
        var toAdd = allDesired.Where(kv => !existingIds.Contains(kv.Key)).Select(kv => kv.Value).ToList();

        if (toAdd.Count == 0)
        {
            _logger.LogInformation("CourseSections already fully seeded — skipping.");
            return;
        }

        await _db.CourseSections.AddRangeAsync(toAdd, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} new course sections.", toAdd.Count);
    }
}