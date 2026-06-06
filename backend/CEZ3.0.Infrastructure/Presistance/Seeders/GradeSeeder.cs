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
        _db.ChangeTracker.Clear();
        var now = DateTime.UtcNow;

        var allDesired = new Dictionary<ObjectId, Grade>
        {
            // Assignment 1 — auto-graded quiz grades
            [SeedIds.Grade1] = new() { Id = SeedIds.Grade1, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student1, PointsRecieved = 10, Mark = "A", Feedback = "Perfect score — excellent work!",                              GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade2] = new() { Id = SeedIds.Grade2, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student2, PointsRecieved = 5,  Mark = "C", Feedback = "Good effort. Review question 1 on variable isolation.",         GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade3] = new() { Id = SeedIds.Grade3, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student3, PointsRecieved = 10, Mark = "A", Feedback = "All correct, great job!",                                      GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade4] = new() { Id = SeedIds.Grade4, AssignmentId = SeedIds.Assignment1, UserId = SeedIds.Student4, PointsRecieved = 0,  Mark = "F", Feedback = "Please revisit the material and arrange a consultation.",       GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 2 — manually graded literature test
            [SeedIds.Grade5] = new() { Id = SeedIds.Grade5, AssignmentId = SeedIds.Assignment2, UserId = SeedIds.Student1, PointsRecieved = 18, Mark = "A", Feedback = "Excellent analysis of Mickiewicz's themes.",                   GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade6] = new() { Id = SeedIds.Grade6, AssignmentId = SeedIds.Assignment2, UserId = SeedIds.Student2, PointsRecieved = 14, Mark = "B", Feedback = "Good understanding, but missing some historical context.",      GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 3 — CS quiz
            [SeedIds.Grade7] = new() { Id = SeedIds.Grade7, AssignmentId = SeedIds.Assignment3, UserId = SeedIds.Student1, PointsRecieved = 15, Mark = "A", Feedback = "Perfect. You clearly understand C# fundamentals.",             GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade8] = new() { Id = SeedIds.Grade8, AssignmentId = SeedIds.Assignment3, UserId = SeedIds.Student5, PointsRecieved = 10, Mark = "B", Feedback = "Good effort. Review value vs reference types for next time.",   GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 5 — Geometry manual test
            [SeedIds.Grade9]  = new() { Id = SeedIds.Grade9,  AssignmentId = SeedIds.Assignment5, UserId = SeedIds.Student1, PointsRecieved = 25, Mark = "B", Feedback = "Good work, but the proof for theorem 3 needs more rigor. Review the axiomatic approach to Euclidean geometry.", GradedById = SeedIds.Teacher1, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 6 — Physics quiz
            [SeedIds.Grade10] = new() { Id = SeedIds.Grade10, AssignmentId = SeedIds.Assignment6, UserId = SeedIds.Student1, PointsRecieved = 10, Mark = "A", Feedback = "Doskonale! Wszystkie odpowiedzi poprawne.",                     GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade11] = new() { Id = SeedIds.Grade11, AssignmentId = SeedIds.Assignment6, UserId = SeedIds.Student2, PointsRecieved = 5,  Mark = "C", Feedback = "Popraw znajomość jednostek SI.",                                  GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 7 — Physics manual test
            [SeedIds.Grade12] = new() { Id = SeedIds.Grade12, AssignmentId = SeedIds.Assignment7, UserId = SeedIds.Student1, PointsRecieved = 20, Mark = "B", Feedback = "Dobrze opisana zasada, brakuje przykładu liczbowego.",             GradedById = SeedIds.Teacher2, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 8 — Biology quiz
            [SeedIds.Grade13] = new() { Id = SeedIds.Grade13, AssignmentId = SeedIds.Assignment8, UserId = SeedIds.Student1, PointsRecieved = 10, Mark = "A", Feedback = "Świetnie! Budowa komórki opanowana w 100%.",                      GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
            [SeedIds.Grade14] = new() { Id = SeedIds.Grade14, AssignmentId = SeedIds.Assignment8, UserId = SeedIds.Student3, PointsRecieved = 5,  Mark = "C", Feedback = "Przypomnij sobie funkcje organelli komórkowych.",                   GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },

            // Assignment 9 — Biology manual test
            [SeedIds.Grade15] = new() { Id = SeedIds.Grade15, AssignmentId = SeedIds.Assignment9, UserId = SeedIds.Student1, PointsRecieved = 22, Mark = "B", Feedback = "Dobra znajomość zasad azotowych, brakuje opisu replikacji.",        GradedById = SeedIds.Teacher3, Assignment = null!, User = null!, GradedBy = null!, CreatedAt = now },
        };

        var existingIds = await _db.Grades.AsNoTracking().Select(g => g.Id).ToListAsync(cancellationToken);
        var toAdd = allDesired.Where(kv => !existingIds.Contains(kv.Key)).Select(kv => kv.Value).ToList();

        if (toAdd.Count == 0)
        {
            _logger.LogInformation("Grades already fully seeded — skipping.");
            return;
        }

        await _db.Grades.AddRangeAsync(toAdd, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} new grades.", toAdd.Count);
    }
}