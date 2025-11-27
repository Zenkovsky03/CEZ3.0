using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;

namespace CEZ3._0.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    public UserRepository(CezDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    private readonly CezDbContext _dbContext;

    public async Task<User?> GetUserByLoginAsync(string login)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == login && u.IsActive);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
    }

    public async Task AddUserAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User?> GetByIdAsync(MongoDB.Bson.ObjectId userId)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
