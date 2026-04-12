using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class AssignmentSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<AssignmentSeeder> _logger;

    public int Order => 6;

    public AssignmentSeeder(CezDbContext db, ILogger<AssignmentSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Assignments.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Assignments already seeded — skipping.");
            return;
        }

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        // Question IDs — all exactly 24 hex chars
        var q1Id = new ObjectId("b1000000000000000000aa01");
        var q2Id = new ObjectId("b1000000000000000000aa02");
        var q3Id = new ObjectId("b1000000000000000000aa03");

        // Answer IDs — all exactly 24 hex chars
        var a01 = new ObjectId("b2000000000000000000bb01");
        var a02 = new ObjectId("b2000000000000000000bb02");
        var a03 = new ObjectId("b2000000000000000000bb03");
        var a04 = new ObjectId("b2000000000000000000bb04");
        var a05 = new ObjectId("b2000000000000000000bb05");
        var a06 = new ObjectId("b2000000000000000000bb06");
        var a07 = new ObjectId("b2000000000000000000bb07");
        var a08 = new ObjectId("b2000000000000000000bb08");
        var a09 = new ObjectId("b2000000000000000000bb09");
        var a10 = new ObjectId("b2000000000000000000bb0a");
        var a11 = new ObjectId("b2000000000000000000bb0b");

        var assignments = new List<Assignment>
        {
            new()
            {
                Id           = SeedIds.Assignment1,
                CourseId     = SeedIds.Course1,
                SectionId    = SeedIds.Section1Course1,
                Title        = "Algebra Basics Quiz",
                Description  = "Short quiz on variables and basic operations.",
                MaxPoint     = 10,
                DueDate      = now.AddDays(14),
                TaskType     = "Quiz",
                IsAutoGraded = true,
                CreatedAt    = now,
                Questions    = new List<QuizQuestion>
                {
                    new()
                    {
                        Id      = q1Id,
                        Text    = "What is the value of x if 2x = 8?",
                        Type    = "SingleChoice",
                        Points  = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = a01, Text = "2", IsCorrect = false },
                            new() { Id = a02, Text = "4", IsCorrect = true  },
                            new() { Id = a03, Text = "6", IsCorrect = false },
                            new() { Id = a04, Text = "8", IsCorrect = false },
                        }
                    },
                    new()
                    {
                        Id      = q2Id,
                        Text    = "Which of the following are prime numbers?",
                        Type    = "MultipleChoice",
                        Points  = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = a05, Text = "2", IsCorrect = true  },
                            new() { Id = a06, Text = "4", IsCorrect = false },
                            new() { Id = a07, Text = "7", IsCorrect = true  },
                            new() { Id = a08, Text = "9", IsCorrect = false },
                        }
                    },
                }
            },
            new()
            {
                Id           = SeedIds.Assignment2,
                CourseId     = SeedIds.Course2,
                SectionId    = SeedIds.Section1Course2,
                Title        = "Romanticism Knowledge Test",
                Description  = "Test covering the key themes of Polish Romanticism.",
                MaxPoint     = 20,
                DueDate      = now.AddDays(21),
                TaskType     = "Test",
                IsAutoGraded = false,
                CreatedAt    = now,
                Questions    = new List<QuizQuestion>
                {
                    new()
                    {
                        Id      = q3Id,
                        Text    = "Which work is Mickiewicz's national epic?",
                        Type    = "SingleChoice",
                        Points  = 10,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = a09, Text = "Pan Tadeusz",      IsCorrect = true  },
                            new() { Id = a10, Text = "Dziady",           IsCorrect = false },
                            new() { Id = a11, Text = "Konrad Wallenrod", IsCorrect = false },
                        }
                    },
                }
            },
        };

        await _db.Assignments.AddRangeAsync(assignments, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} assignments.", assignments.Count);
    }
}