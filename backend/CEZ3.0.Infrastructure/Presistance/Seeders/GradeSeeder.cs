using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class GradeSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<GradeSeeder> _logger;

    public int Order => 9;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var grades = new List<Grade>
        {
            // Assignment 1 — auto-graded quiz grades
            new() { Id = SeedIds.Grade1, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student1, PointsRecieved = 10, Mark = "A",  Feedback = "Perfect score — excellent work!",                              GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            new() { Id = SeedIds.Grade2, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student2, PointsRecieved = 5,  Mark = "C",  Feedback = "Good effort. Review question 1 on variable isolation.",         GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            new() { Id = SeedIds.Grade3, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student3, PointsRecieved = 10, Mark = "A",  Feedback = "All correct, great job!",                                      GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            new() { Id = SeedIds.Grade4, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student4, PointsRecieved = 0,  Mark = "F",  Feedback = "Please revisit the material and arrange a consultation.",       GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 2 — manually graded literature test
            new() { Id = SeedIds.Grade5, AssignmentId = SeedIds.Assignment2, UserId = SeedIds.Student1, PointsRecieved = 18, Mark = "A",  Feedback = "Excellent analysis of Mickiewicz's themes.",                   GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            new() { Id = SeedIds.Grade6, AssignmentId = SeedIds.Assignment2, UserId = SeedIds.Student2, PointsRecieved = 14, Mark = "B",  Feedback = "Good understanding, but missing some historical context.",      GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 3 — CS quiz
            new() { Id = SeedIds.Grade7, AssignmentId = SeedIds.Assignment3, UserId = SeedIds.Student1, PointsRecieved = 15, Mark = "A",  Feedback = "Perfect. You clearly understand C# fundamentals.",             GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            new() { Id = SeedIds.Grade8, AssignmentId = SeedIds.Assignment3, UserId = SeedIds.Student5, PointsRecieved = 10, Mark = "B",  Feedback = "Good effort. Review value vs reference types for next time.",   GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
        };

        await _db.Grades.AddRangeAsync(grades, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} grades.", grades.Count);
    }
}