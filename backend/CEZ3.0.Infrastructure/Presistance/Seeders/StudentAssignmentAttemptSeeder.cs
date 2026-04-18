using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class StudentAssignmentAttemptSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<StudentAssignmentAttemptSeeder> _logger;

    public int Order => 8;

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

        var attempts = new List<StudentAssignmentAttempt>
        {
            // ── Assignment 1 (Algebra Quiz, max 10) ───────────────────────────────────
            new() { Id = SeedIds.Attempt1, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student1, StartedAt = now.AddHours(-10), FinishedAt = now.AddHours(-9),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_2 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_1, SeedIds.A1_Q2_3 } } } },

            new() { Id = SeedIds.Attempt2, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student2, StartedAt = now.AddHours(-8),  FinishedAt = now.AddHours(-7),  IsCompleted = true, FinalScore = 5,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_1 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_1, SeedIds.A1_Q2_3 } } } },

            new() { Id = SeedIds.Attempt3, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student3, StartedAt = now.AddHours(-6),  FinishedAt = now.AddHours(-5),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_2 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_1, SeedIds.A1_Q2_3 } } } },

            new() { Id = SeedIds.Attempt4, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student4, StartedAt = now.AddHours(-5),  FinishedAt = now.AddHours(-4),  IsCompleted = true, FinalScore = 0,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_3 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_2, SeedIds.A1_Q2_4 } } } },

            // ── Assignment 3 (CS Quiz, max 15) ────────────────────────────────────────
            new() { Id = SeedIds.Attempt5, AssignmentId = SeedIds.Assignment3, StudentId = SeedIds.Student1, StartedAt = now.AddHours(-4),  FinishedAt = now.AddHours(-3),  IsCompleted = true, FinalScore = 15,
                Selections = new() { new() { QuestionId = SeedIds.Q3_1, SelectedAnswerIds = new() { SeedIds.A3_Q2_2 } }, new() { QuestionId = SeedIds.Q3_2, SelectedAnswerIds = new() { SeedIds.A3_Q3_1, SeedIds.A3_Q3_3 } }, new() { QuestionId = SeedIds.Q3_3, SelectedAnswerIds = new() { SeedIds.A4_Q1_1 } } } },

            new() { Id = SeedIds.Attempt6, AssignmentId = SeedIds.Assignment3, StudentId = SeedIds.Student5, StartedAt = now.AddHours(-3),  FinishedAt = now.AddHours(-2),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q3_1, SelectedAnswerIds = new() { SeedIds.A3_Q2_2 } }, new() { QuestionId = SeedIds.Q3_2, SelectedAnswerIds = new() { SeedIds.A3_Q3_1 } }, new() { QuestionId = SeedIds.Q3_3, SelectedAnswerIds = new() { SeedIds.A4_Q1_2 } } } },

            // ── Assignment 4 (English Quiz, max 10) ───────────────────────────────────
            new() { Id = SeedIds.Attempt7, AssignmentId = SeedIds.Assignment4, StudentId = SeedIds.Student6, StartedAt = now.AddHours(-2),  FinishedAt = now.AddHours(-1),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q4_1, SelectedAnswerIds = new() { SeedIds.A4_Q2_2 } }, new() { QuestionId = SeedIds.Q4_2, SelectedAnswerIds = new() { SeedIds.A4_Q2_2 } } } },

            new() { Id = SeedIds.Attempt8, AssignmentId = SeedIds.Assignment4, StudentId = SeedIds.Student7, StartedAt = now.AddMinutes(-90), FinishedAt = now.AddMinutes(-30), IsCompleted = true, FinalScore = 5,
                Selections = new() { new() { QuestionId = SeedIds.Q4_1, SelectedAnswerIds = new() { SeedIds.A4_Q2_1 } }, new() { QuestionId = SeedIds.Q4_2, SelectedAnswerIds = new() { SeedIds.A4_Q2_2 } } } },
        };

        await _db.Attempts.AddRangeAsync(attempts, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} student attempts.", attempts.Count);
    }
}