using CEZ3._0.Domain.Constants.Communication;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class ConversationSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<ConversationSeeder> _logger;

    public int Order => 12;

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

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        var conversations = new List<Conversation>
        {
            new() { Id = SeedIds.Conversation1, Title = "Question about Algebra homework",       Type = ConversationType.Inquiry, Status = InquirySatus.Open,                    CreatorId = SeedIds.Student1, RecipientId = SeedIds.Teacher1, CreatedAt = now.AddHours(-5),  UpdatedAt = now.AddHours(-1) },
            new() { Id = SeedIds.Conversation2, Title = "Feedback on Romanticism test",          Type = ConversationType.Inquiry, Status = InquirySatus.AwaitingStudentResponse,  CreatorId = SeedIds.Teacher2, RecipientId = SeedIds.Student3, CreatedAt = now.AddHours(-3),  UpdatedAt = now.AddMinutes(-30) },
            new() { Id = SeedIds.Conversation3, Title = "Help with C# value types",             Type = ConversationType.Inquiry, Status = InquirySatus.Open,                    CreatorId = SeedIds.Student5, RecipientId = SeedIds.Teacher3, CreatedAt = now.AddHours(-2),  UpdatedAt = now.AddHours(-1) },
            new() { Id = SeedIds.Conversation4, Title = "Essay submission clarification",        Type = ConversationType.Inquiry, Status = InquirySatus.Closed,                  CreatorId = SeedIds.Student8, RecipientId = SeedIds.Teacher1, CreatedAt = now.AddDays(-3),   UpdatedAt = now.AddDays(-1),  ClosedAt = now.AddDays(-1) },
            new() { Id = SeedIds.Conversation5, Title = "Grade appeal — Algebra quiz",          Type = ConversationType.Inquiry, Status = InquirySatus.AwaitingTeacherResponse,  CreatorId = SeedIds.Student4, RecipientId = SeedIds.Teacher1, CreatedAt = now.AddHours(-1),  UpdatedAt = now.AddMinutes(-10) },
            new() { Id = SeedIds.Conversation6, Title = "Question about sorting in C#",         Type = ConversationType.Inquiry, Status = InquirySatus.AwaitingStudentResponse, CreatorId = SeedIds.Student1, RecipientId = SeedIds.Teacher3, CreatedAt = now.AddHours(-7),  UpdatedAt = now.AddHours(-5) },
        };

        await _db.Conversations.AddRangeAsync(conversations, cancellationToken);

        var messages = new List<ChatMessage>
        {
            // Conversation 1
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation1, SenderId = SeedIds.Student1, Body = "Hello, I'm having trouble understanding exercise 3 in Chapter 1.", SentAt = now.AddHours(-5), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation1, SenderId = SeedIds.Teacher1, Body = "Hi Jakub! Let's walk through it. Which part is confusing you specifically?", SentAt = now.AddHours(-4), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation1, SenderId = SeedIds.Student1, Body = "The isolating variable step — I'm not sure when to divide vs subtract first.", SentAt = now.AddHours(-3), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation1, SenderId = SeedIds.Teacher1, Body = "Great question! Always move constant terms to one side first using addition/subtraction, then divide. I'll add an example to the materials.", SentAt = now.AddHours(-1), IsRead = false },

            // Conversation 2
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation2, SenderId = SeedIds.Teacher2, Body = "Piotr, I've reviewed your test. You showed a solid understanding of Mickiewicz but missed the historical context of Dziady Part 2.", SentAt = now.AddHours(-3), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation2, SenderId = SeedIds.Student3, Body = "Thank you for the feedback! Could you recommend any additional reading?", SentAt = now.AddHours(-2), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation2, SenderId = SeedIds.Teacher2, Body = "Yes — check the supplemental document in Unit 1 of the course. It covers the political context of the era.", SentAt = now.AddMinutes(-30), IsRead = false },

            // Conversation 3
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation3, SenderId = SeedIds.Student5, Body = "Hi, I got question 2 wrong on the CS quiz. Can you explain why bool is a value type?", SentAt = now.AddHours(-2), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation3, SenderId = SeedIds.Teacher3, Body = "Sure! Value types store data directly on the stack. bool, int, char — they all live on the stack. string is a reference type and lives on the heap.", SentAt = now.AddHours(-1), IsRead = false },

            // Conversation 4 (closed)
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation4, SenderId = SeedIds.Student8, Body = "I'm not sure about the essay submission format. Should it be PDF or Word?", SentAt = now.AddDays(-3), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation4, SenderId = SeedIds.Teacher1, Body = "Either format is fine, but PDF is preferred so formatting stays consistent.", SentAt = now.AddDays(-2), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation4, SenderId = SeedIds.Student8, Body = "Got it, thank you!", SentAt = now.AddDays(-1), IsRead = true },

            // Conversation 5
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation5, SenderId = SeedIds.Student4, Body = "I believe my quiz score is incorrect. I selected 7 as a prime number but it was marked wrong.", SentAt = now.AddHours(-1), IsRead = false },

            // Conversation 6
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation6, SenderId = SeedIds.Student1, Body = "Hello, I have a question about bubble sort vs insertion sort from the materials in Module 1. Which one should I use for small arrays?", SentAt = now.AddHours(-7), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation6, SenderId = SeedIds.Teacher3, Body = "Great question! For small arrays (say < 50 elements), insertion sort is generally preferred. It has O(n) best-case performance when the array is nearly sorted. Bubble sort is mainly educational. I posted a code example in the forum thread you opened.", SentAt = now.AddHours(-6), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation6, SenderId = SeedIds.Student1, Body = "Thank you! I saw your reply on the forum — the code example really helped me understand the implementation difference.", SentAt = now.AddHours(-5), IsRead = true },
            new() { Id = ObjectId.GenerateNewId(), ConversationId = SeedIds.Conversation6, SenderId = SeedIds.Teacher3, Body = "You're welcome! I'd suggest trying to implement both algorithms on your own and timing them with Stopwatch. That'll give you a practical understanding of the performance differences.", SentAt = now.AddHours(-5).AddMinutes(10), IsRead = false },
        };

        await _db.Messages.AddRangeAsync(messages, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {C} conversations and {M} messages.", conversations.Count, messages.Count);
    }
}