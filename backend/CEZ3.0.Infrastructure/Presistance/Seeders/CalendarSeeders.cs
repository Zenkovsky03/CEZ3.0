using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class AnnouncementSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<AnnouncementSeeder> _logger;

    public int Order => 10;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var announcements = new List<Announcement>
        {
            new() { Id = SeedIds.Announcement1, Title = "Welcome to the new semester!",            Content = "We're excited to begin the new academic term. Please review your course schedules and make sure you are enrolled in all relevant courses.",   CreatedAt = now,              IsActive = true,  CreatedById = SeedIds.Admin,    CreatedBy = null! },
            new() { Id = SeedIds.Announcement2, Title = "Scheduled maintenance — Saturday night",  Content = "The platform will be unavailable from 23:00 to 01:00 on Saturday for routine maintenance. Please save your work beforehand.",                CreatedAt = now.AddDays(-2),  IsActive = true,  CreatedById = SeedIds.Admin,    CreatedBy = null! },
            new() { Id = SeedIds.Announcement3, Title = "Mid-term results are now available",      Content = "Mid-term grades have been published. You can view your results in the Grades section. Contact your teacher if you have any questions.",       CreatedAt = now.AddDays(-5),  IsActive = true,  CreatedById = SeedIds.Teacher1, CreatedBy = null! },
            new() { Id = SeedIds.Announcement4, Title = "Library resources updated",               Content = "New reference materials have been added to the digital library. Access them via the Resources tab in each course.",                           CreatedAt = now.AddDays(-7),  IsActive = true,  CreatedById = SeedIds.Admin,    CreatedBy = null! },
        };

        await _db.Announcements.AddRangeAsync(announcements, cancellationToken);

        var allUsers = new[] { SeedIds.Admin, SeedIds.Teacher1, SeedIds.Teacher2, SeedIds.Teacher3, SeedIds.Student1, SeedIds.Student2, SeedIds.Student3, SeedIds.Student4, SeedIds.Student5, SeedIds.Student6, SeedIds.Student7, SeedIds.Student8, SeedIds.Student9, SeedIds.Student10 };
        var userAnnouncements = new List<UserAnnouncement>();

        foreach (var ann in announcements)
            foreach (var uid in allUsers)
                userAnnouncements.Add(new UserAnnouncement { Id = ObjectId.GenerateNewId(), UserId = uid, AnnouncementId = ann.Id, User = null!, Announcement = null!, IsActive = true, CreatedAt = now });

        await _db.UserAnnouncements.AddRangeAsync(userAnnouncements, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {AC} announcements and {UA} user-announcement links.", announcements.Count, userAnnouncements.Count);
    }
}

public class EventSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<EventSeeder> _logger;

    public int Order => 11;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var events = new List<Event>
        {
            new() { Id = SeedIds.Event1, Title = "Parent-Teacher Meeting",    Description = "Quarterly meeting between parents and class teachers.",            StartTime = now.AddDays(7),  EndTime = now.AddDays(7).AddHours(2),  CreatedAt = now, CreatedById = SeedIds.Admin,    IsActive = true, CreatedBy = null! },
            new() { Id = SeedIds.Event2, Title = "Mid-term Exam Week",        Description = "Mid-term assessments across all courses.",                         StartTime = now.AddDays(30), EndTime = now.AddDays(35),             CreatedAt = now, CreatedById = SeedIds.Admin,    IsActive = true, CreatedBy = null! },
            new() { Id = SeedIds.Event3, Title = "School Open Day",           Description = "Prospective students and parents are invited to tour the school.", StartTime = now.AddDays(14), EndTime = now.AddDays(14).AddHours(4), CreatedAt = now, CreatedById = SeedIds.Admin,    IsActive = true, CreatedBy = null! },
            new() { Id = SeedIds.Event4, Title = "C# Workshop — Extra Class", Description = "Optional workshop on advanced C# features for Course 3 students.", StartTime = now.AddDays(5),  EndTime = now.AddDays(5).AddHours(2),  CreatedAt = now, CreatedById = SeedIds.Teacher3, IsActive = true, CreatedBy = null! },
        };

        await _db.Events.AddRangeAsync(events, cancellationToken);

        var allUsers = new[] { SeedIds.Admin, SeedIds.Teacher1, SeedIds.Teacher2, SeedIds.Teacher3, SeedIds.Student1, SeedIds.Student2, SeedIds.Student3, SeedIds.Student4, SeedIds.Student5, SeedIds.Student6, SeedIds.Student7, SeedIds.Student8, SeedIds.Student9, SeedIds.Student10 };
        var userEvents = new List<UserEvent>();

        foreach (var ev in events)
            foreach (var uid in allUsers)
                userEvents.Add(new UserEvent { Id = ObjectId.GenerateNewId(), UserId = uid, EventId = ev.Id, User = null!, Event = null!, IsActive = true, CreatedAt = now });

        await _db.UserEvents.AddRangeAsync(userEvents, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {EC} events and {UE} user-event links.", events.Count, userEvents.Count);
    }
}