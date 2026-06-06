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
        var anyExists = await _db.Courses.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Courses already seeded — skipping.");
            return;
        }

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var courses = new List<Course>
        {
            new() { Id = SeedIds.Course1, Name = "Introduction to Mathematics",      Description = "Foundations of algebra, geometry and calculus for first-year students.", StartDate = now.AddDays(-30),  EndDate = now.AddDays(150), Archived = false, OwnerId = SeedIds.Teacher1, Owner = null!, CreatedAt = now, IsPasswordProtected = false },
            new() { Id = SeedIds.Course2, Name = "Polish Literature & Composition",  Description = "Survey of Polish prose and poetry from the Romantic era to the present.", StartDate = now.AddDays(-15), EndDate = now.AddDays(165), Archived = false, OwnerId = SeedIds.Teacher2, Owner = null!, CreatedAt = now, IsPasswordProtected = false },
            new() { Id = SeedIds.Course3, Name = "Introduction to Computer Science", Description = "Core concepts of programming, algorithms and data structures using C#.",   StartDate = now.AddDays(-10), EndDate = now.AddDays(170), Archived = false, OwnerId = SeedIds.Teacher3, Owner = null!, CreatedAt = now, IsPasswordProtected = false },
            new() { Id = SeedIds.Course4, Name = "English for Academic Purposes",    Description = "Academic writing, presentation skills and professional communication.",    StartDate = now.AddDays(-45), EndDate = now.AddDays(60),  Archived = false, OwnerId = SeedIds.Teacher1, Owner = null!, CreatedAt = now, IsPasswordProtected = false },
            new() { Id = SeedIds.Course5, Name = "Fizyka klasyczna",                 Description = "Mechanika klasyczna, termodynamika i podstawy elektromagnetyzmu.",                  StartDate = now.AddDays(-20), EndDate = now.AddDays(160), Archived = false, OwnerId = SeedIds.Teacher2, Owner = null!, CreatedAt = now, IsPasswordProtected = false },
            new() { Id = SeedIds.Course6, Name = "Biologia ogólna",                  Description = "Podstawy biologii komórki, genetyki i ekologii.",                               StartDate = now.AddDays(-10), EndDate = now.AddDays(170), Archived = false, OwnerId = SeedIds.Teacher3, Owner = null!, CreatedAt = now, IsPasswordProtected = false },
        };

        await _db.Courses.AddRangeAsync(courses, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} courses.", courses.Count);
    }
}