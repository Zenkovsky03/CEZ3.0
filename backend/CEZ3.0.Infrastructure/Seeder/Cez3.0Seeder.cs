using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance;
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


        private string HashPassword(string password)
        {
            string hashedPasswordString = BCrypt.Net.BCrypt.HashPassword(password);
            return hashedPasswordString;
        }
    }
}