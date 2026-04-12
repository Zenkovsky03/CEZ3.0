using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class StudentAssignmentAttemptSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<StudentAssignmentAttemptSeeder> _logger;

    public int Order => 7;

    public StudentAssignmentAttemptSeeder(CezDbContext db, ILogger<StudentAssignmentAttemptSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Attempts.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("StudentAssignmentAttempts already seeded — skipping.");
            return;
        }

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        // Must match the stable answer IDs defined in AssignmentSeeder
        var q1Id = new ObjectId("b1000000000000000000aa01");
        var q2Id = new ObjectId("b1000000000000000000aa02");

        var correctQ1  = new ObjectId("b2000000000000000000bb02"); // "4"
        var wrongQ1    = new ObjectId("b2000000000000000000bb01"); // "2"
        var correctQ2a = new ObjectId("b2000000000000000000bb05"); // "2"
        var correctQ2b = new ObjectId("b2000000000000000000bb07"); // "7"

        var attempts = new List<StudentAssignmentAttempt>
        {
            // Student1 — perfect score
            new()
            {
                Id           = SeedIds.Attempt1,
                AssignmentId = SeedIds.Assignment1,
                StudentId    = SeedIds.Student1,
                StartedAt    = now.AddHours(-2),
                FinishedAt   = now.AddHours(-1),
                IsCompleted  = true,
                FinalScore   = 10,
                Selections   = new List<StudentSelection>
                {
                    new() { QuestionId = q1Id, SelectedAnswerIds = new List<ObjectId> { correctQ1 } },
                    new() { QuestionId = q2Id, SelectedAnswerIds = new List<ObjectId> { correctQ2a, correctQ2b } },
                }
            },
            // Student2 — partial score
            new()
            {
                Id           = SeedIds.Attempt2,
                AssignmentId = SeedIds.Assignment1,
                StudentId    = SeedIds.Student2,
                StartedAt    = now.AddHours(-3),
                FinishedAt   = now.AddHours(-2),
                IsCompleted  = true,
                FinalScore   = 5,
                Selections   = new List<StudentSelection>
                {
                    new() { QuestionId = q1Id, SelectedAnswerIds = new List<ObjectId> { wrongQ1 } },
                    new() { QuestionId = q2Id, SelectedAnswerIds = new List<ObjectId> { correctQ2a, correctQ2b } },
                }
            },
        };

        await _db.Attempts.AddRangeAsync(attempts, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} student attempts.", attempts.Count);
    }
}