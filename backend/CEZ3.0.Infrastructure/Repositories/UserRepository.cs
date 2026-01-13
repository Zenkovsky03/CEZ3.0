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

    public async Task<User?> GetByIdAsync(ObjectId userId)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        return await _dbContext.Users.Where(u => u.IsActive == true).CountAsync();
    }

    public async Task<List<User>> GetUsersAsync(int pageNumber, int pageSize, bool? orderBy, bool? isActive, string? role, string? email)
    {
        var query = _dbContext.Users
                        .AsNoTracking()
                        .AsQueryable();

        // By default, filter out soft-deleted users (IsActive = false)
        if (isActive.HasValue && isActive != null)
            query = query.Where(u => u.IsActive == isActive.Value);
        else
            query = query.Where(u => u.IsActive == true);

        if (!string.IsNullOrEmpty(role))
            query = query.Where(u => u.Role == role);

        if (!string.IsNullOrEmpty(email))
            query = query.Where(u => u.Email.ToLower().Contains(email.ToLower()));


        if (orderBy.HasValue)
        {
            if (orderBy.Value)
                query = query.OrderBy(u => u.CreatedAt);
            else
                query = query.OrderByDescending(u => u.CreatedAt);
        }

        return await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<User>> GetUsersByRoleAsync(string role)
    {
        return await _dbContext.Users
            .AsNoTracking()
            .Where(u => u.Role == role && u.IsActive)
            .ToListAsync();
    }
}
