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

    public int Order => 8;

    public StudentAssignmentAttemptSeeder(CezDbContext db, ILogger<StudentAssignmentAttemptSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        _db.ChangeTracker.Clear();
        var now = DateTime.UtcNow;

        var allDesired = new Dictionary<ObjectId, StudentAssignmentAttempt>
        {
            // ── Assignment 1 (Algebra Quiz, max 10) ───────────────────────────────
            [SeedIds.Attempt1] = new() { Id = SeedIds.Attempt1, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student1, StartedAt = now.AddHours(-10), FinishedAt = now.AddHours(-9),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_2 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_1, SeedIds.A1_Q2_3 } } } },

            [SeedIds.Attempt2] = new() { Id = SeedIds.Attempt2, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student2, StartedAt = now.AddHours(-8),  FinishedAt = now.AddHours(-7),  IsCompleted = true, FinalScore = 5,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_1 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_1, SeedIds.A1_Q2_3 } } } },

            [SeedIds.Attempt3] = new() { Id = SeedIds.Attempt3, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student3, StartedAt = now.AddHours(-6),  FinishedAt = now.AddHours(-5),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_2 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_1, SeedIds.A1_Q2_3 } } } },

            [SeedIds.Attempt4] = new() { Id = SeedIds.Attempt4, AssignmentId = SeedIds.Assignment1, StudentId = SeedIds.Student4, StartedAt = now.AddHours(-5),  FinishedAt = now.AddHours(-4),  IsCompleted = true, FinalScore = 0,
                Selections = new() { new() { QuestionId = SeedIds.Q1_1, SelectedAnswerIds = new() { SeedIds.A1_Q1_3 } }, new() { QuestionId = SeedIds.Q1_2, SelectedAnswerIds = new() { SeedIds.A1_Q2_2, SeedIds.A1_Q2_4 } } } },

            // ── Assignment 3 (CS Quiz, max 15) ────────────────────────────────────
            [SeedIds.Attempt5] = new() { Id = SeedIds.Attempt5, AssignmentId = SeedIds.Assignment3, StudentId = SeedIds.Student1, StartedAt = now.AddHours(-4),  FinishedAt = now.AddHours(-3),  IsCompleted = true, FinalScore = 15,
                Selections = new() { new() { QuestionId = SeedIds.Q3_1, SelectedAnswerIds = new() { SeedIds.A3_Q2_2 } }, new() { QuestionId = SeedIds.Q3_2, SelectedAnswerIds = new() { SeedIds.A3_Q3_1, SeedIds.A3_Q3_3 } }, new() { QuestionId = SeedIds.Q3_3, SelectedAnswerIds = new() { SeedIds.A4_Q1_1 } } } },

            [SeedIds.Attempt6] = new() { Id = SeedIds.Attempt6, AssignmentId = SeedIds.Assignment3, StudentId = SeedIds.Student5, StartedAt = now.AddHours(-3),  FinishedAt = now.AddHours(-2),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q3_1, SelectedAnswerIds = new() { SeedIds.A3_Q2_2 } }, new() { QuestionId = SeedIds.Q3_2, SelectedAnswerIds = new() { SeedIds.A3_Q3_1 } }, new() { QuestionId = SeedIds.Q3_3, SelectedAnswerIds = new() { SeedIds.A4_Q1_2 } } } },

            // ── Assignment 4 (English Quiz, max 10) ───────────────────────────────
            [SeedIds.Attempt7] = new() { Id = SeedIds.Attempt7, AssignmentId = SeedIds.Assignment4, StudentId = SeedIds.Student6, StartedAt = now.AddHours(-2),  FinishedAt = now.AddHours(-1),  IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q4_1, SelectedAnswerIds = new() { SeedIds.A4_Q2_2 } }, new() { QuestionId = SeedIds.Q4_2, SelectedAnswerIds = new() { SeedIds.A4_Q2_2 } } } },

            [SeedIds.Attempt8] = new() { Id = SeedIds.Attempt8, AssignmentId = SeedIds.Assignment4, StudentId = SeedIds.Student7, StartedAt = now.AddMinutes(-90), FinishedAt = now.AddMinutes(-30), IsCompleted = true, FinalScore = 5,
                Selections = new() { new() { QuestionId = SeedIds.Q4_1, SelectedAnswerIds = new() { SeedIds.A4_Q2_1 } }, new() { QuestionId = SeedIds.Q4_2, SelectedAnswerIds = new() { SeedIds.A4_Q2_2 } } } },

            // ── Assignment 2 (Lit, manual, max 20) — Student1 submit ─────────────
            [SeedIds.Attempt9] = new() { Id = SeedIds.Attempt9, AssignmentId = SeedIds.Assignment2, StudentId = SeedIds.Student1, StartedAt = now.AddDays(-3), FinishedAt = now.AddDays(-2), IsCompleted = true, FinalScore = 18,
                SubmissionText = "Romantyzm w twórczości Adama Mickiewicza charakteryzuje się " +
                                 "głębokim patriotyzmem oraz mistycyzmem. W 'Panu Tadeuszu' autor " +
                                 "przedstawia obraz szlachty polskiej, łącząc realizm obyczajowy " +
                                 "z elementami ludowości. Najważniejszym dziełem epoki narodowej " +
                                 "jest bez wątpienia 'Pan Tadeusz', który stanowi syntezę gatunków " +
                                 "literackich i stylów. Mickiewicz mistrzowsko operuje kontrastem " +
                                 "między światem realnym a metafizycznym, co szczególnie widoczne " +
                                 "jest w 'Dziadach'. Jego twórczość wywarła ogromny wpływ na " +
                                 "kształtowanie się świadomości narodowej Polaków w XIX wieku." },

            // ── Assignment 5 (Geometry, manual, max 30) — Student1 submit ────────
            [SeedIds.Attempt10] = new() { Id = SeedIds.Attempt10, AssignmentId = SeedIds.Assignment5, StudentId = SeedIds.Student1, StartedAt = now.AddDays(-1), FinishedAt = now.AddHours(-12), IsCompleted = true, FinalScore = 25,
                SubmissionText = "Twierdzenie Pitagorasa: a² + b² = c²\n\n" +
                                 "Dowód:\n" +
                                 "1. Rozważmy trójkąt prostokątny o przyprostokątnych a, b i przeciwprostokątnej c.\n" +
                                 "2. Tworzymy kwadrat o boku a + b, w którym umieszczamy cztery " +
                                 "przystające trójkąty prostokątne.\n" +
                                 "3. Pole dużego kwadratu: (a + b)² = a² + 2ab + b²\n" +
                                 "4. Pole czterech trójkątów: 4 × (½ab) = 2ab\n" +
                                 "5. Pole wewnętrznego kwadratu (przeciwprostokątna): c²\n" +
                                 "6. Zatem: (a + b)² = 2ab + c² → a² + b² = c²\n\n" +
                                 "Kąt prosty ma 180 stopni, co wynika z definicji kąta " +
                                 "półpełnego jako sumy dwóch kątów prostych." },

            // ── Assignment 6 (Physics Quiz, max 10) ──────────────────────────────
            [SeedIds.Attempt11] = new() { Id = SeedIds.Attempt11, AssignmentId = SeedIds.Assignment6, StudentId = SeedIds.Student1, StartedAt = now.AddHours(-6), FinishedAt = now.AddHours(-5), IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q6_1, SelectedAnswerIds = new() { SeedIds.A6_Q1_2 } }, new() { QuestionId = SeedIds.Q6_2, SelectedAnswerIds = new() { SeedIds.A6_Q2_1, SeedIds.A6_Q2_3 } } } },

            [SeedIds.Attempt12] = new() { Id = SeedIds.Attempt12, AssignmentId = SeedIds.Assignment6, StudentId = SeedIds.Student2, StartedAt = now.AddHours(-5), FinishedAt = now.AddHours(-4), IsCompleted = true, FinalScore = 5,
                Selections = new() { new() { QuestionId = SeedIds.Q6_1, SelectedAnswerIds = new() { SeedIds.A6_Q1_1 } }, new() { QuestionId = SeedIds.Q6_2, SelectedAnswerIds = new() { SeedIds.A6_Q2_1 } } } },

            // ── Assignment 7 (Physics Test, manual, max 25) — Student1 ──────────
            [SeedIds.Attempt13] = new() { Id = SeedIds.Attempt13, AssignmentId = SeedIds.Assignment7, StudentId = SeedIds.Student1, StartedAt = now.AddDays(-2), FinishedAt = now.AddDays(-1), IsCompleted = true, FinalScore = 20,
                SubmissionText = "Zadanie 1: Omów pierwszą zasadę termodynamiki.\n\n" +
                                 "Pierwsza zasada termodynamiki (zasada zachowania energii) mówi, że " +
                                 "energia wewnętrzna układu może zmieniać się na skutek wykonania pracy " +
                                 "lub wymiany ciepła z otoczeniem. Matematycznie: ΔU = Q + W, gdzie " +
                                 "ΔU to zmiana energii wewnętrznej, Q to ciepło dostarczone do układu, " +
                                 "a W to praca wykonana nad układem.\n\n" +
                                 "Przykład: sprężanie gazu w cylindrze - wykonujemy pracę nad gazem, " +
                                 "co zwiększa jego energię wewnętrzną i temperaturę." },

            // ── Assignment 8 (Biology Quiz, max 10) ─────────────────────────────
            [SeedIds.Attempt14] = new() { Id = SeedIds.Attempt14, AssignmentId = SeedIds.Assignment8, StudentId = SeedIds.Student1, StartedAt = now.AddHours(-4), FinishedAt = now.AddHours(-3), IsCompleted = true, FinalScore = 10,
                Selections = new() { new() { QuestionId = SeedIds.Q8_1, SelectedAnswerIds = new() { SeedIds.A8_Q1_2 } }, new() { QuestionId = SeedIds.Q8_2, SelectedAnswerIds = new() { SeedIds.A8_Q2_1, SeedIds.A8_Q2_3 } } } },

            [SeedIds.Attempt15] = new() { Id = SeedIds.Attempt15, AssignmentId = SeedIds.Assignment8, StudentId = SeedIds.Student3, StartedAt = now.AddHours(-3), FinishedAt = now.AddHours(-2), IsCompleted = true, FinalScore = 5,
                Selections = new() { new() { QuestionId = SeedIds.Q8_1, SelectedAnswerIds = new() { SeedIds.A8_Q1_1 } }, new() { QuestionId = SeedIds.Q8_2, SelectedAnswerIds = new() { SeedIds.A8_Q2_1 } } } },

            // ── Assignment 9 (Biology Test, manual, max 25) — Student1 ──────────
            [SeedIds.Attempt16] = new() { Id = SeedIds.Attempt16, AssignmentId = SeedIds.Assignment9, StudentId = SeedIds.Student1, StartedAt = now.AddDays(-1), FinishedAt = now.AddHours(-6), IsCompleted = true, FinalScore = 22,
                SubmissionText = "Zadanie 1: Wymień i opisz zasady azotowe w DNA.\n\n" +
                                 "DNA zbudowane jest z czterech zasad azotowych:\n" +
                                 "- Adenina (A) - zasada purynowa\n" +
                                 "- Tymina (T) - zasada pirymidynowa\n" +
                                 "- Cytozyna (C) - zasada pirymidynowa\n" +
                                 "- Guanina (G) - zasada purynowa\n\n" +
                                 "Reguła Chargaffa: A = T, C = G. Zasady łączą się parami poprzez " +
                                 "wiązania wodorowe: A-T (2 wiązania) i C-G (3 wiązania)." },
        };

        var existingIds = await _db.Attempts.AsNoTracking().Select(a => a.Id).ToListAsync(cancellationToken);
        var toAdd = allDesired.Where(kv => !existingIds.Contains(kv.Key)).Select(kv => kv.Value).ToList();

        if (toAdd.Count == 0)
        {
            _logger.LogInformation("StudentAssignmentAttempts already fully seeded — skipping.");
            return;
        }

        await _db.Attempts.AddRangeAsync(toAdd, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} new student attempts.", toAdd.Count);
    }
}