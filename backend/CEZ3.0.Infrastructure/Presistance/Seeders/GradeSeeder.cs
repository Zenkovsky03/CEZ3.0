using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeds grades for the two completed attempts.
/// Order 8 — requires Assignments + Users (for GradedById).
/// PointsRecieved must not exceed Assignment.MaxPoint (10 for Assignment1).
/// Mark is optional; populate if your grading scale uses letter marks.
/// </summary>
public class GradeSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<GradeSeeder> _logger;

    public int Order => 8;

    public GradeSeeder(CezDbContext db, ILogger<GradeSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Grades.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Grades already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts from navigation properties tracked in earlier seeders.
        _db.ChangeTracker.Clear();

        var grades = new List<Grade>
        {
            new()
            {
                Id              = SeedIds.Grade1,
                AssignmentId    = SeedIds.Assignment1,
                UserId          = SeedIds.Student1,
                PointsRecieved  = 10,
                Mark            = "A",
                Feedback        = "Excellent work — all answers correct.",
                GradedById      = SeedIds.Teacher1,
                CreatedAt       = now,
            },
            new()
            {
                Id              = SeedIds.Grade2,
                AssignmentId    = SeedIds.Assignment1,
                UserId          = SeedIds.Student2,
                PointsRecieved  = 5,
                Mark            = "C",
                Feedback        = "Good effort. Review question 1 on variable isolation.",
                GradedById      = SeedIds.Teacher1,
                CreatedAt       = now,
            },
        };

        await _db.Grades.AddRangeAsync(grades, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} grades.", grades.Count);
    }
}