using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
using MongoDB.Bson;
using MongoDB.Driver;


namespace CEZ3._0.Infrastructure.Seeder
{

    public class Cez3_0Seeder(CezDbContext dbContext) : ICez3_0Seeder
    {
        private readonly CezDbContext _dbContext = dbContext;

        public async Task Seed()
        {
            if (!_dbContext.Users.Any())
            {
                _dbContext.Users.AddRange(CreateUsers());
                await _dbContext.SaveChangesAsync();
            }

            if (!_dbContext.Courses.Any())
            {
                var courses = CreateCourses();
                if (courses.Any())
                {
                    _dbContext.Courses.AddRange(courses);
                    await _dbContext.SaveChangesAsync();
                }
            }



        }


        private List<User> CreateUsers()
        {
            var passwordHash = HashPassword("Password123!");

            var users = new List<User>
            {
                new User
                {
                    FirstName = "Jan",
                    LastName = "Kowalski",
                    Username = "jan.kowalski",
                    Email = "jan.kowalski@example.com",
                    PasswordHash = passwordHash,
                    Role = UserRoles.Student.ToString(),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    FirstName = "Lukasz",
                    LastName = "Kopka",
                    Username = "admin",
                    Email = "admin@admin.com",
                    PasswordHash = passwordHash,
                    Role = UserRoles.Admin.ToString(),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };



            return users;
        }

        private List<Course> CreateCourses()
        {
            var teacher = _dbContext.Users.FirstOrDefault(u => u.Role == UserRoles.Teacher.ToString());
            var admin = _dbContext.Users.FirstOrDefault(u => u.Role == UserRoles.Admin.ToString());

            if (teacher == null && admin == null)
            {
                return new List<Course>();
            }

            var courses = new List<Course>
        {
            new Course
            {
                Id = ObjectId.GenerateNewId(),
                Name = "Programowanie w C#",
                Description = "Kurs podstaw programowania w języku C#. Nauczysz się składni, programowania obiektowego oraz pracy z .NET.",
                StartDate = new DateTime(2025, 2, 1),
                EndDate = new DateTime(2025, 6, 30),
                Archived = false,
                OwnerId = teacher?.Id ?? admin!.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Course
            {
                Id = ObjectId.GenerateNewId(),
                Name = "Bazy danych SQL",
                Description = "Wprowadzenie do relacyjnych baz danych. Poznasz SQL, projektowanie schematów oraz optymalizację zapytań.",
                StartDate = new DateTime(2025, 2, 15),
                EndDate = new DateTime(2025, 5, 31),
                Archived = false,
                OwnerId = teacher?.Id ?? admin!.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Course
            {
                Id = ObjectId.GenerateNewId(),
                Name = "Tworzenie aplikacji webowych",
                Description = "Kurs fullstack development. Frontend (HTML, CSS, JavaScript) oraz Backend (ASP.NET Core).",
                StartDate = new DateTime(2025, 3, 1),
                EndDate = new DateTime(2025, 7, 31),
                Archived = false,
                OwnerId = admin?.Id ?? teacher!.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Course
            {
                Id = ObjectId.GenerateNewId(),
                Name = "Algorytmy i struktury danych",
                Description = "Podstawy algorytmiki, złożoność obliczeniowa, struktury danych: listy, drzewa, grafy.",
                StartDate = new DateTime(2024, 10, 1),
                EndDate = new DateTime(2025, 1, 31),
                Archived = true,  // Kurs archiwalny
                OwnerId = teacher?.Id ?? admin!.Id,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new Course
            {
                Id = ObjectId.GenerateNewId(),
                Name = "Testowanie oprogramowania",
                Description = "Unit testy, testy integracyjne, TDD. Narzędzia: xUnit, NUnit, Moq.",
                StartDate = new DateTime(2025, 4, 1),
                EndDate = new DateTime(2025, 6, 30),
                Archived = false,
                OwnerId = admin?.Id ?? teacher!.Id,
                CreatedAt = DateTime.UtcNow
            }
        };

            return courses;
        }

        private string HashPassword(string password)
        {
            string hashedPasswordString = BCrypt.Net.BCrypt.HashPassword(password);
            return hashedPasswordString;
        }
    }
}