using CEZ3._0.Domain.Constants.Communication;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

/// <summary>
/// Seeds conversations and their chat messages.
/// Order 11 — requires Users.
/// ConversationType and InquiryStatus enums must match your Domain constants.
/// </summary>
public class ConversationSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<ConversationSeeder> _logger;

    public int Order => 11;

    public ConversationSeeder(CezDbContext db, ILogger<ConversationSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Conversations.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Conversations already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;

        // Prevent EF change tracker conflicts.
        _db.ChangeTracker.Clear();

        var conversations = new List<Conversation>
        {
            // Student → Teacher inquiry
            new()
            {
                Id          = SeedIds.Conversation1,
                Title       = "Question about Algebra homework",
                Type        = ConversationType.Inquiry,   // = 1
                Status      = InquirySatus.Open,
                CreatorId   = SeedIds.Student1,
                RecipientId = SeedIds.Teacher1,
                CreatedAt   = now.AddHours(-5),
                UpdatedAt   = now.AddHours(-1),
            },
            // Teacher → Student feedback thread
            new()
            {
                Id          = SeedIds.Conversation2,
                Title       = "Feedback on Romanticism test",
                Type        = ConversationType.Inquiry,   // = 1
                Status      = InquirySatus.AwaitingStudentResponse,
                CreatorId   = SeedIds.Teacher2,
                RecipientId = SeedIds.Student3,
                CreatedAt   = now.AddHours(-3),
                UpdatedAt   = now.AddMinutes(-30),
            },
        };

        await _db.Conversations.AddRangeAsync(conversations, cancellationToken);

        var messages = new List<ChatMessage>
        {
            new()
            {
                Id             = ObjectId.GenerateNewId(),
                ConversationId = SeedIds.Conversation1,
                SenderId       = SeedIds.Student1,
                Body           = "Hello, I'm having trouble understanding exercise 3 in Chapter 1.",
                SentAt         = now.AddHours(-5),
                IsRead         = true,
            },
            new()
            {
                Id             = ObjectId.GenerateNewId(),
                ConversationId = SeedIds.Conversation1,
                SenderId       = SeedIds.Teacher1,
                Body           = "Hi Jakub! Let's walk through it together. What part is confusing you?",
                SentAt         = now.AddHours(-4),
                IsRead         = true,
            },
            new()
            {
                Id             = ObjectId.GenerateNewId(),
                ConversationId = SeedIds.Conversation2,
                SenderId       = SeedIds.Teacher2,
                Body           = "Piotr, I've reviewed your test. You showed a solid understanding of Mickiewicz.",
                SentAt         = now.AddHours(-3),
                IsRead         = false,
            },
        };

        await _db.Messages.AddRangeAsync(messages, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Seeded {CCount} conversations and {MCount} chat messages.",
            conversations.Count, messages.Count);
    }
}