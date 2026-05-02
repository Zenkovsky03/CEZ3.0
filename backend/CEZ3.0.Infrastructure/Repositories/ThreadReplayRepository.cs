using CEZ3._0.Domain.Entities.Forum;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Repositories;

public class ThreadReplayRepository(CezDbContext dbContext) : IThreadReplayRepository
{
    private readonly CezDbContext _dbContext = dbContext;

    public async Task<string> CreateThreadReplayAsync(ThreadReplay threadReplay)
    {
        await _dbContext.ThreadReplays.AddAsync(threadReplay);
        await _dbContext.SaveChangesAsync();

        return threadReplay.Id.ToString();
    }

    public async Task<List<ThreadReplay>> GetReplaysByThreadIdAsync(ObjectId threadId, int pageNumber, int pageSize)
    {
        var query = _dbContext.ThreadReplays
                .AsNoTracking()
                .AsQueryable();

        return await query.Where(r => r.ThreadId == threadId && r.IsActive)
                     .OrderBy(r => r.CreatedAt)
                     .Skip((pageNumber - 1) * pageSize)
                     .Take(pageSize)
                     .ToListAsync();
    }

    public async Task<ThreadReplay?> GetThreadReplayByIdAsync(ObjectId replayId)
    {
        return await _dbContext.ThreadReplays
            .FirstOrDefaultAsync(r => r.Id == replayId && r.IsActive);
    }

    public async Task<int> GetTotalReplaysByThreadIdAsync(ObjectId threadId)
    {
        return await _dbContext.ThreadReplays
            .Where(r => r.ThreadId == threadId && r.IsActive)
            .CountAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
