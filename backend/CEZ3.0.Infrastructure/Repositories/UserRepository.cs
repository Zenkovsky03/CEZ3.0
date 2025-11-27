using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

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
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == login);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddUserAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User?> GetByIdAsync(ObjectId userId)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<User>> GetUsersAsync(int pageNumber, int pageSize)
    {
        return await _dbContext.Users
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        return await _dbContext.Users.CountAsync();
    }

}
