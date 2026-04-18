using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class UserSeeder : ISeeder
{
    private readonly CezDbContext _db;
    private readonly ILogger<UserSeeder> _logger;

    public int Order => 1;

    public UserSeeder(CezDbContext db, ILogger<UserSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var anyExists = await _db.Users.AsNoTracking().AnyAsync(cancellationToken);
        if (anyExists)
        {
            _logger.LogInformation("Users already seeded — skipping.");
            return;
        }

        var now = DateTime.UtcNow;
        string Hash(string p) => BCrypt.Net.BCrypt.HashPassword(p);

        var users = new List<User>
        {
            // ── Admin ──────────────────────────────────────────────
            new() { Id = SeedIds.Admin,    FirstName = "Admin",   LastName = "System",       Username = "admin",    Email = "admin@cez.local",    PasswordHash = Hash("Password123!"), Role = "Admin",   IsActive = true, CreatedAt = now },

            // ── Teachers ───────────────────────────────────────────
            new() { Id = SeedIds.Teacher1, FirstName = "Anna",    LastName = "Kowalska",     Username = "teacher1", Email = "teacher1@cez.local", PasswordHash = Hash("Password123!"), Role = "Teacher", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Teacher2, FirstName = "Marek",   LastName = "Nowak",        Username = "teacher2", Email = "teacher2@cez.local", PasswordHash = Hash("Password123!"), Role = "Teacher", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Teacher3, FirstName = "Katarzyna",LastName = "Wiśniewska",  Username = "teacher3", Email = "teacher3@cez.local", PasswordHash = Hash("Password123!"), Role = "Teacher", IsActive = true, CreatedAt = now },

            // ── Students ───────────────────────────────────────────
            new() { Id = SeedIds.Student1,  FirstName = "Jakub",   LastName = "Wiśniewski",  Username = "student1",  Email = "student1@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student2,  FirstName = "Zofia",   LastName = "Wójcik",      Username = "student2",  Email = "student2@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student3,  FirstName = "Piotr",   LastName = "Krawczyk",    Username = "student3",  Email = "student3@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student4,  FirstName = "Marta",   LastName = "Zając",       Username = "student4",  Email = "student4@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student5,  FirstName = "Tomasz",  LastName = "Lewandowski", Username = "student5",  Email = "student5@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student6,  FirstName = "Aleksandra", LastName = "Dąbrowska", Username = "student6", Email = "student6@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student7,  FirstName = "Michał",  LastName = "Kowalczyk",   Username = "student7",  Email = "student7@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student8,  FirstName = "Natalia", LastName = "Kamińska",    Username = "student8",  Email = "student8@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student9,  FirstName = "Bartosz", LastName = "Szczepański", Username = "student9",  Email = "student9@cez.local",  PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
            new() { Id = SeedIds.Student10, FirstName = "Karolina",LastName = "Woźniak",     Username = "student10", Email = "student10@cez.local", PasswordHash = Hash("Password123!"), Role = "Student", IsActive = true, CreatedAt = now },
        };

        await _db.Users.AddRangeAsync(users, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded {Count} users.", users.Count);
    }
}