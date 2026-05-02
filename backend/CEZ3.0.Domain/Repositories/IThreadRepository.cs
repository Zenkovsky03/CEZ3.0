using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IThreadRepository
{
    Task<string> AddThreadAsync(Entities.Forum.Thread thread);
    Task<Entities.Forum.Thread?> GetThreadByIdAsync(ObjectId threadId);
    Task<Entities.Forum.Thread?> GetActiveThreadByIdAsync(ObjectId threadId);
    Task<List<Entities.Forum.Thread>> GetThreadsHeaderAsync(int pageNumber, int pageSize);
    Task SaveChangesAsync();
}
