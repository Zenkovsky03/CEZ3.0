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
    Task<List<User>> GetUsersAsync(int pageNumber, int pageSize, bool? orderBy, bool? isActive, string? role, string? email);
    Task<List<User>> GetUsersByRoleAsync(string role);
    Task<List<User>> GetByIdsAsync(List<ObjectId> ids);
    Task<int> GetTotalUsersCountAsync();
}
