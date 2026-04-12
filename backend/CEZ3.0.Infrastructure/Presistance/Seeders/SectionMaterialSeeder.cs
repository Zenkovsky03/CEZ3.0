using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeds materials for the seeded sections.
/// Order 5 — requires CourseSections.
/// MaterialType values match whatever your Application layer expects
/// (e.g. "Lesson", "Video", "Document" — adjust as needed).
/// </summary>
public class SectionMaterialSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<SectionMaterialSeeder> _logger;

    public int Order => 5;

    public SectionMaterialSeeder(CezDbContext db, ILogger<SectionMaterialSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.SectionMaterials.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("SectionMaterials already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts from navigation properties tracked in earlier seeders.
        _db.ChangeTracker.Clear();

        var materials = new List<SectionMaterial>
        {
            new()
            {
                Id           = SeedIds.Material1,
                SectionId    = SeedIds.Section1Course1,
                Title        = "Variables and Expressions",
                Content      = "A variable is a symbol that represents an unknown quantity. In algebra we use letters such as x, y, z.",
                MaterialType = "Lesson",
                CreatedAt    = now,
            },
            new()
            {
                Id           = SeedIds.Material2,
                SectionId    = SeedIds.Section2Course1,
                Title        = "Points, Lines and Planes",
                Content      = "Euclidean geometry begins with the undefined notions of point, line and plane.",
                MaterialType = "Lesson",
                CreatedAt    = now,
            },
            new()
            {
                Id           = SeedIds.Material3,
                SectionId    = SeedIds.Section1Course2,
                Title        = "Adam Mickiewicz — Life and Works",
                Content      = "Adam Mickiewicz (1798–1855) is considered the greatest Polish Romantic poet.",
                MaterialType = "Document",
                CreatedAt    = now,
            },
        };

        await _db.SectionMaterials.AddRangeAsync(materials, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} section materials.", materials.Count);
    }
}