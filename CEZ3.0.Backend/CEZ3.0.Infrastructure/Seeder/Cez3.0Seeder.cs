using BCrypt.Net;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Presistance; 
using MongoDB.Driver;
using System.Text;
using SystemTasks = System.Threading.Tasks;

namespace CEZ3._0.Infrastructure.Seeder
{

    public class Cez3_0Seeder(CezDbContext dbContext) : ICez3_0Seeder
    {
        private readonly CezDbContext _dbContext = dbContext;

        public async SystemTasks.Task Seed()
        {
            if (!_dbContext.Users.Any())
            {
                _dbContext.Users.AddRange(CreateUsers());
                await _dbContext.SaveChangesAsync();
            }

        }


        private User CreateUsers()
        {
            var passwordHash = HashPassword("Password123!");

            var user = new User
            {
                FirstName = "Jan",
                LastName = "Kowalski",
                Username = "jan.kowalski",
                Email = "jan.kowalski@example.com",
                PasswordHash = passwordHash,
                Role = "student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            return user;
        }


        private string HashPassword(string password)
        {
            string hashedPasswordString = BCrypt.Net.BCrypt.HashPassword(password);
            return hashedPasswordString;
        }
    }
}