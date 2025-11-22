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
    public Task<User?> GetUserByLoginAsync(string login)
    {
        return _dbContext.Users.FirstOrDefaultAsync(u => u.Username == login);
    }

    public Task<User?> GetUserByEmailAsync(string email)
    {
        return _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddUserAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
