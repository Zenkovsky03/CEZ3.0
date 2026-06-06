using CEZ3._0.Domain.Entities.Forum;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class ForumSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<ForumSeeder> _logger;

    public int Order => 6;

    public ForumSeeder(CezDbContext db, ILogger<ForumSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Threads.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Forum threads already seeded — skipping.");
            return;
        }

        _db.ChangeTracker.Clear();

        var now = DateTime.UtcNow;

        // ── Thread 1: Algebra question (Student1 -> Teacher1) ─────────────
        var thread1Id = ObjectId.GenerateNewId();
        var thread1 = new Domain.Entities.Forum.Thread
        {
            Id = thread1Id, Title = "Pytanie o równania liniowe",
            Content = "Dzień dobry, mam problem z zadaniem 3 z rozdziału 1. " +
                      "Nie wiem jak przekształcić równanie 2x + 5 = 13. Czy mógłbym prosić o wskazówkę?",
            AuthorId = SeedIds.Student1, CreatedAt = now.AddHours(-12),
            IsOpen = true, IsActive = true, TotalReplies = 2
        };

        // ── Thread 2: Literature materials (Student3 -> Teacher2) ──────────
        var thread2Id = ObjectId.GenerateNewId();
        var thread2 = new Domain.Entities.Forum.Thread
        {
            Id = thread2Id, Title = "Dodatkowe materiały do romantyzmu",
            Content = "Czy są jakieś dodatkowe lektury pomocne do zrozumienia kontekstu " +
                      "historycznego Dziadów? Chciałbym poszerzyć swoją wiedzę przed sprawdzianem.",
            AuthorId = SeedIds.Student3, CreatedAt = now.AddDays(-2),
            IsOpen = true, IsActive = true, TotalReplies = 2
        };

        // ── Thread 3: C# reference types (Student5 -> Teacher3) ───────────
        var thread3Id = ObjectId.GenerateNewId();
        var thread3 = new Domain.Entities.Forum.Thread
        {
            Id = thread3Id, Title = "Pytanie o typy referencyjne w C#",
            Content = "Cześć, mam pytanie dotyczące różnicy między typami wartościowymi a referencyjnymi. " +
                      "Dlaczego string zachowuje się jak value type skoro jest typem referencyjnym?",
            AuthorId = SeedIds.Student5, CreatedAt = now.AddDays(-1),
            IsOpen = true, IsActive = true, TotalReplies = 1
        };

        // ── Thread 4: Essay format (Student8 -> Teacher1, closed) ─────────
        var thread4Id = ObjectId.GenerateNewId();
        var thread4 = new Domain.Entities.Forum.Thread
        {
            Id = thread4Id, Title = "Problem z formatem eseju",
            Content = "Dzień dobry, w jakim formacie należy przesłać esej z zajęć z języka angielskiego? " +
                      "Czy PDF jest wymagany, czy mogę przesłać dokument Word?",
            AuthorId = SeedIds.Student8, CreatedAt = now.AddDays(-5),
            IsOpen = false, IsActive = true, TotalReplies = 2
        };

        // ── Thread 5: Sorting algorithms (Student1 -> Teacher3) ───────────
        var thread5Id = ObjectId.GenerateNewId();
        var thread5 = new Domain.Entities.Forum.Thread
        {
            Id = thread5Id, Title = "Pytanie o algorytmy sortowania w C#",
            Content = "Cześć, próbuję zrozumieć różnicę między sortowaniem bąbelkowym " +
                      "a sortowaniem przez wstawianie. Który algorytm jest bardziej wydajny " +
                      "dla małych zbiorów danych? Próbowałem znaleźć przykłady w materiałach, " +
                      "ale chciałbym zobaczyć praktyczną implementację.",
            AuthorId = SeedIds.Student1, CreatedAt = now.AddHours(-8),
            IsOpen = true, IsActive = true, TotalReplies = 1
        };

        var threads = new List<Domain.Entities.Forum.Thread> { thread1, thread2, thread3, thread4, thread5 };
        await _db.Threads.AddRangeAsync(threads, cancellationToken);

        // ── Replies ───────────────────────────────────────────────────────
        var replies = new List<ThreadReplay>
        {
            // Thread 1 replies
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread1Id,
                Content = "Witaj! Aby rozwiązać 2x + 5 = 13, najpierw odejmij 5 od obu stron: " +
                          "2x = 8. Następnie podziel obie strony przez 2: x = 4. " +
                          "Spróbuj wykonać podobne przekształcenia w pozostałych przykładach.",
                AuthorId = SeedIds.Teacher1, AuthorName = "Anna Kowalska",
                CreatedAt = now.AddHours(-11), IsActive = true },
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread1Id,
                Content = "Dziękuję! Już rozumiem. Teraz pozostałe przykłady idą mi dużo lepiej.",
                AuthorId = SeedIds.Student1, AuthorName = "Jakub Wiśniewski",
                CreatedAt = now.AddHours(-10), IsActive = true },

            // Thread 2 replies
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread2Id,
                Content = "Polecam rozdziały 4-6 z podręcznika 'Historia literatury polskiej' " +
                          "oraz artykuł o kontekście politycznym epoki w materiałach dodatkowych kursu. " +
                          "Szczególnie zwróć uwagę na wpływ zaborów na twórczość Mickiewicza.",
                AuthorId = SeedIds.Teacher2, AuthorName = "Marek Nowak",
                CreatedAt = now.AddDays(-1).AddHours(-10), IsActive = true },
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread2Id,
                Content = "Ja również polecam te materiały! Bardzo pomogły mi w zrozumieniu " +
                          "kontekstu historycznego. Szczególnie artykuł o powstaniu listopadowym.",
                AuthorId = SeedIds.Student5, AuthorName = "Tomasz Lewandowski",
                CreatedAt = now.AddDays(-1).AddHours(-6), IsActive = true },

            // Thread 3 reply
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread3Id,
                Content = "Świetne pytanie! string jest typem referencyjnym, ale zachowuje się " +
                          "jak value type ze względu na swoją niemutowalność. " +
                          "Po przypisaniu nowej wartości do zmiennej string, w rzeczywistości " +
                          "tworzony jest nowy obiekt w pamięci, a nie modyfikowany istniejący. " +
                          "Zapraszam na konsultacje, jeśli chcesz przećwiczyć to na przykładach.",
                AuthorId = SeedIds.Teacher3, AuthorName = "Katarzyna Wiśniewska",
                CreatedAt = now.AddHours(-20), IsActive = true },

            // Thread 3 — Student1 adds a helpful reply
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread3Id,
                Content = "Mogę dodać od siebie przykład: int x = 5; zmienia wartość na stosie, " +
                          "ale string s = \"hello\"; s = \"world\"; tworzy nowy obiekt w heapie. " +
                          "Na quizie z C# miałem podobne pytanie i pomogło mi myślenie o tym " +
                          "w kategoriach 'gdzie dane są przechowywane'.",
                AuthorId = SeedIds.Student1, AuthorName = "Jakub Wiśniewski",
                CreatedAt = now.AddHours(-18), IsActive = true },

            // Thread 5 reply
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread5Id,
                Content = "Świetne pytanie! Dla małych zbiorów danych (np. do 50 elementów) " +
                          "oba algorytmy działają podobnie szybko. Sortowanie bąbelkowe ma " +
                          "złożoność O(n²) w każdym przypadku, podczas gdy sortowanie przez " +
                          "wstawianie działa w O(n) dla danych już posortowanych. " +
                          "Oto przykład implementacji w C#:\n\n" +
                          "for (int i = 1; i < arr.Length; i++) {\n" +
                          "    int key = arr[i];\n" +
                          "    int j = i - 1;\n" +
                          "    while (j >= 0 && arr[j] > key) {\n" +
                          "        arr[j + 1] = arr[j];\n" +
                          "        j--;\n" +
                          "    }\n" +
                          "    arr[j + 1] = key;\n" +
                          "}\n\n" +
                          "Zapraszam na konsultacje, jeśli chcesz przećwiczyć to na tablicy.",
                AuthorId = SeedIds.Teacher3, AuthorName = "Katarzyna Wiśniewska",
                CreatedAt = now.AddHours(-6), IsActive = true },

            // Thread 4 replies (closed thread)
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread4Id,
                Content = "PDF jest preferowany, ale dokument Word również jest akceptowany. " +
                          "Upewnij się, że plik zawiera Twoje imię i nazwisko w nazwie. " +
                          "Termin upływa w najbliższy piątek.",
                AuthorId = SeedIds.Teacher1, AuthorName = "Anna Kowalska",
                CreatedAt = now.AddDays(-4), IsActive = true },
            new() { Id = ObjectId.GenerateNewId(), ThreadId = thread4Id,
                Content = "Rozumiem, dziękuję za szybką odpowiedź! Prześlę w formacie PDF.",
                AuthorId = SeedIds.Student8, AuthorName = "Natalia Kamińska",
                CreatedAt = now.AddDays(-3), IsActive = true },
        };

        await _db.ThreadReplays.AddRangeAsync(replies, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {TC} threads and {RC} replies.", threads.Count, replies.Count);
    }
}
