using CEZ3._0.Domain.Entities.Forum;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IThreadReplayRepository
{
    Task<string> CreateThreadReplayAsync(ThreadReplay threadReplay);
    Task<List<ThreadReplay>> GetReplaysByThreadIdAsync(ObjectId threadId, int pageNumber, int pageSize);
    Task<int> GetTotalReplaysByThreadIdAsync(ObjectId threadId);
    Task<ThreadReplay?> GetThreadReplayByIdAsync(ObjectId replayId);
    Task SaveChangesAsync();

}
