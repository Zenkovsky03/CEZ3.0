using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class AssignmentSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<AssignmentSeeder> _logger;

    public int Order => 7;

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

        var assignments = new List<Assignment>
        {
            // ── Assignment 1: Algebra Quiz (auto-graded) ──────────────
            new()
            {
                Id = SeedIds.Assignment1, CourseId = SeedIds.Course1, SectionId = SeedIds.Section1Course1,
                Title = "Algebra Basics Quiz", Description = "Short quiz on variables and basic operations.",
                MaxPoint = 10, DueDate = now.AddDays(14), TaskType = "Quiz", IsAutoGraded = true, CreatedAt = now,
                Questions = new List<QuizQuestion>
                {
                    new() { Id = SeedIds.Q1_1, Text = "What is the value of x if 2x = 8?", Type = "SingleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A1_Q1_1, Text = "2", IsCorrect = false },
                            new() { Id = SeedIds.A1_Q1_2, Text = "4", IsCorrect = true  },
                            new() { Id = SeedIds.A1_Q1_3, Text = "6", IsCorrect = false },
                            new() { Id = SeedIds.A1_Q1_4, Text = "8", IsCorrect = false },
                        }
                    },
                    new() { Id = SeedIds.Q1_2, Text = "Which of the following are prime numbers?", Type = "MultipleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A1_Q2_1, Text = "2", IsCorrect = true  },
                            new() { Id = SeedIds.A1_Q2_2, Text = "4", IsCorrect = false },
                            new() { Id = SeedIds.A1_Q2_3, Text = "7", IsCorrect = true  },
                            new() { Id = SeedIds.A1_Q2_4, Text = "9", IsCorrect = false },
                        }
                    },
                }
            },

            // ── Assignment 2: Literature Test (manual) ─────────────────
            new()
            {
                Id = SeedIds.Assignment2, CourseId = SeedIds.Course2, SectionId = SeedIds.Section1Course2,
                Title = "Romanticism Knowledge Test", Description = "Test covering key themes of Polish Romanticism.",
                MaxPoint = 20, DueDate = now.AddDays(21), TaskType = "Test", IsAutoGraded = false, CreatedAt = now,
                Questions = new List<QuizQuestion>
                {
                    new() { Id = SeedIds.Q2_1, Text = "Which work is Mickiewicz's national epic?", Type = "SingleChoice", Points = 20,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A3_Q1_1, Text = "Pan Tadeusz",      IsCorrect = true  },
                            new() { Id = SeedIds.A3_Q1_2, Text = "Dziady",           IsCorrect = false },
                            new() { Id = SeedIds.A3_Q1_3, Text = "Konrad Wallenrod", IsCorrect = false },
                        }
                    },
                }
            },

            // ── Assignment 3: CS Quiz (auto-graded) ────────────────────
            new()
            {
                Id = SeedIds.Assignment3, CourseId = SeedIds.Course3, SectionId = SeedIds.Section1Course3,
                Title = "C# Fundamentals Quiz", Description = "Quiz covering basic C# syntax and types.",
                MaxPoint = 15, DueDate = now.AddDays(10), TaskType = "Quiz", IsAutoGraded = true, CreatedAt = now,
                Questions = new List<QuizQuestion>
                {
                    new() { Id = SeedIds.Q3_1, Text = "Which keyword declares a constant in C#?", Type = "SingleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A3_Q2_1, Text = "static", IsCorrect = false },
                            new() { Id = SeedIds.A3_Q2_2, Text = "const",  IsCorrect = true  },
                            new() { Id = SeedIds.A3_Q2_3, Text = "fixed",  IsCorrect = false },
                        }
                    },
                    new() { Id = SeedIds.Q3_2, Text = "Which of these are value types in C#?", Type = "MultipleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A3_Q3_1, Text = "int",    IsCorrect = true  },
                            new() { Id = SeedIds.A3_Q3_2, Text = "string", IsCorrect = false },
                            new() { Id = SeedIds.A3_Q3_3, Text = "bool",   IsCorrect = true  },
                        }
                    },
                    new() { Id = SeedIds.Q3_3, Text = "What does OOP stand for?", Type = "SingleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A4_Q1_1, Text = "Object-Oriented Programming",  IsCorrect = true  },
                            new() { Id = SeedIds.A4_Q1_2, Text = "Ordered Operation Processing", IsCorrect = false },
                            new() { Id = SeedIds.A4_Q1_3, Text = "Optional Output Parameter",    IsCorrect = false },
                        }
                    },
                }
            },

            // ── Assignment 4: English Quiz (auto-graded) ───────────────
            new()
            {
                Id = SeedIds.Assignment4, CourseId = SeedIds.Course4, SectionId = SeedIds.Section1Course4,
                Title = "Essay Structure Quiz", Description = "Quiz on academic essay structure.",
                MaxPoint = 10, DueDate = now.AddDays(7), TaskType = "Quiz", IsAutoGraded = true, CreatedAt = now,
                Questions = new List<QuizQuestion>
                {
                    new() { Id = SeedIds.Q4_1, Text = "What is the purpose of a topic sentence?", Type = "SingleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A4_Q2_1, Text = "To end the paragraph",               IsCorrect = false },
                            new() { Id = SeedIds.A4_Q2_2, Text = "To introduce the paragraph's idea",  IsCorrect = true  },
                            new() { Id = SeedIds.A4_Q2_3, Text = "To cite a source",                   IsCorrect = false },
                        }
                    },
                    new() { Id = SeedIds.Q4_2, Text = "How many main parts does an academic essay have?", Type = "SingleChoice", Points = 5,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A4_Q2_3, Text = "2", IsCorrect = false },
                            new() { Id = SeedIds.A4_Q2_2, Text = "3", IsCorrect = true  },
                            new() { Id = SeedIds.A4_Q2_1, Text = "4", IsCorrect = false },
                        }
                    },
                }
            },

            // ── Assignment 5: Geometry Test (manual) ───────────────────
            new()
            {
                Id = SeedIds.Assignment5, CourseId = SeedIds.Course1, SectionId = SeedIds.Section2Course1,
                Title = "Geometry Mid-term Test", Description = "Covers points, lines, planes and basic theorems.",
                MaxPoint = 30, DueDate = now.AddDays(28), TaskType = "Test", IsAutoGraded = false, CreatedAt = now,
                Questions = new List<QuizQuestion>
                {
                    new() { Id = SeedIds.Q5_1, Text = "State the Pythagorean theorem.", Type = "SingleChoice", Points = 15,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A5_Q1_1, Text = "a² + b² = c²",   IsCorrect = true  },
                            new() { Id = SeedIds.A5_Q1_2, Text = "a + b = c",       IsCorrect = false },
                            new() { Id = SeedIds.A5_Q1_3, Text = "a² - b² = c²",   IsCorrect = false },
                        }
                    },
                    new() { Id = SeedIds.Q5_2, Text = "How many degrees are in a straight angle?", Type = "SingleChoice", Points = 15,
                        Answers = new List<QuizAnswer>
                        {
                            new() { Id = SeedIds.A5_Q2_1, Text = "90",  IsCorrect = false },
                            new() { Id = SeedIds.A5_Q2_2, Text = "180", IsCorrect = true  },
                            new() { Id = SeedIds.A5_Q2_3, Text = "360", IsCorrect = false },
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