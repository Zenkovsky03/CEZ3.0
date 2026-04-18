using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var materials = new List<SectionMaterial>
        {
            new() { Id = SeedIds.Material1, SectionId = SeedIds.Section1Course1, Section = null!, Title = "Variables and Expressions",          Content = "A variable is a symbol representing an unknown quantity. In algebra we use letters such as x, y, z to denote variables.",                                            MaterialType = "Lesson",    CreatedAt = now },
            new() { Id = SeedIds.Material2, SectionId = SeedIds.Section1Course1, Section = null!, Title = "Solving Linear Equations",           Content = "A linear equation is an equation of degree one. To solve it, isolate the variable on one side using inverse operations.",                                           MaterialType = "Lesson",    CreatedAt = now },
            new() { Id = SeedIds.Material3, SectionId = SeedIds.Section2Course1, Section = null!, Title = "Points, Lines and Planes",           Content = "Euclidean geometry begins with three undefined notions: point, line and plane. All geometric figures are built from these primitives.",                             MaterialType = "Lesson",    CreatedAt = now },
            new() { Id = SeedIds.Material4, SectionId = SeedIds.Section1Course2, Section = null!, Title = "Adam Mickiewicz — Life and Works",   Content = "Adam Mickiewicz (1798–1855) is considered the greatest Polish Romantic poet. His major works include Pan Tadeusz, Dziady, and Konrad Wallenrod.",            MaterialType = "Document",  CreatedAt = now },
            new() { Id = SeedIds.Material5, SectionId = SeedIds.Section2Course2, Section = null!, Title = "Positivism in Poland",               Content = "Polish Positivism followed the January Uprising of 1863. Writers such as Bolesław Prus and Eliza Orzeszkowa promoted work and social progress.",              MaterialType = "Document",  CreatedAt = now },
            new() { Id = SeedIds.Material6, SectionId = SeedIds.Section1Course3, Section = null!, Title = "Introduction to C# Syntax",          Content = "C# is a strongly typed, object-oriented language. Every statement ends with a semicolon. Types must be declared explicitly or use the var keyword.",            MaterialType = "Lesson",    CreatedAt = now },
            new() { Id = SeedIds.Material7, SectionId = SeedIds.Section2Course3, Section = null!, Title = "Classes and Objects",                Content = "A class is a blueprint for objects. It defines properties (data) and methods (behaviour). An object is an instance of a class created with the new keyword.",   MaterialType = "Lesson",    CreatedAt = now },
            new() { Id = SeedIds.Material8, SectionId = SeedIds.Section1Course4, Section = null!, Title = "Structure of an Academic Essay",     Content = "An academic essay has three parts: introduction, body paragraphs and conclusion. Each body paragraph should have a clear topic sentence and supporting evidence.", MaterialType = "Document",  CreatedAt = now },
        };

        await _db.SectionMaterials.AddRangeAsync(materials, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} section materials.", materials.Count);
    }
}