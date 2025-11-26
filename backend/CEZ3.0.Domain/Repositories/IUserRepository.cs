using CEZ3._0.Domain.Entities;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByLoginAsync(string login);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetByIdAsync(ObjectId userId);
    Task AddUserAsync(User user);
    Task SaveChangesAsync();
}
