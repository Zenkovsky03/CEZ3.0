using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeds announcements and their UserAnnouncement join records.
/// Order 9 — requires Users.
/// </summary>
public class AnnouncementSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<AnnouncementSeeder> _logger;

    public int Order => 9;

    public AnnouncementSeeder(CezDbContext db, ILogger<AnnouncementSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Announcements.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Announcements already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts.
        _db.ChangeTracker.Clear();

        var announcements = new List<Announcement>
        {
            new()
            {
                Id          = SeedIds.Announcement1,
                Title       = "Welcome to the new semester!",
                Content     = "We're excited to begin the new academic term. Please review your course schedules.",
                CreatedAt   = now,
                IsActive    = true,
                CreatedById = SeedIds.Admin,
            },
            new()
            {
                Id          = SeedIds.Announcement2,
                Title       = "Scheduled maintenance — Saturday night",
                Content     = "The platform will be unavailable from 23:00 to 01:00 on Saturday.",
                CreatedAt   = now,
                IsActive    = true,
                CreatedById = SeedIds.Admin,
            },
        };

        await _db.Announcements.AddRangeAsync(announcements, cancellationToken);

        // Distribute both announcements to all students
        var studentIds = new[]
        {
            SeedIds.Student1, SeedIds.Student2, SeedIds.Student3,
            SeedIds.Student4, SeedIds.Student5
        };

        var userAnnouncements = new List<UserAnnouncement>();
        foreach (var ann in announcements)
            foreach (var studentId in studentIds)
                userAnnouncements.Add(new UserAnnouncement
                {
                    Id             = ObjectId.GenerateNewId(),
                    UserId         = studentId,
                    AnnouncementId = ann.Id,
                    IsActive       = true,
                    CreatedAt      = now,
                });

        await _db.UserAnnouncements.AddRangeAsync(userAnnouncements, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Seeded {ACount} announcements and {UACount} user-announcement links.",
            announcements.Count, userAnnouncements.Count);
    }
}

/// <summary>
/// Seeds calendar events and UserEvent join records.
/// Order 10 — requires Users.
/// </summary>
public class EventSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<EventSeeder> _logger;

    public int Order => 10;

    public EventSeeder(CezDbContext db, ILogger<EventSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Events.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Events already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts.
        _db.ChangeTracker.Clear();

        var events = new List<Event>
        {
            new()
            {
                Id          = SeedIds.Event1,
                Title       = "Parent-Teacher Meeting",
                Description = "Quarterly meeting between parents and class teachers.",
                StartTime   = now.AddDays(7),
                EndTime     = now.AddDays(7).AddHours(2),
                CreatedAt   = now,
                CreatedById = SeedIds.Admin,
                IsActive    = true,
            },
            new()
            {
                Id          = SeedIds.Event2,
                Title       = "Mid-term Exam Week",
                Description = "Mid-term assessments across all courses.",
                StartTime   = now.AddDays(30),
                EndTime     = now.AddDays(35),
                CreatedAt   = now,
                CreatedById = SeedIds.Admin,
                IsActive    = true,
            },
        };

        await _db.Events.AddRangeAsync(events, cancellationToken);

        var studentIds = new[]
        {
            SeedIds.Student1, SeedIds.Student2, SeedIds.Student3,
            SeedIds.Student4, SeedIds.Student5
        };

        var userEvents = new List<UserEvent>();
        foreach (var ev in events)
            foreach (var studentId in studentIds)
                userEvents.Add(new UserEvent
                {
                    Id        = ObjectId.GenerateNewId(),
                    UserId    = studentId,
                    EventId   = ev.Id,
                    IsActive  = true,
                    CreatedAt = now,
                });

        await _db.UserEvents.AddRangeAsync(userEvents, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Seeded {ECount} events and {UECount} user-event links.",
            events.Count, userEvents.Count);
    }
}