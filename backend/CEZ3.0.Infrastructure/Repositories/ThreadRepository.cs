using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Repositories;

public class ThreadRepository(CezDbContext dbContext) : IThreadRepository
{
    private readonly CezDbContext _dbContext = dbContext;

    public async Task<string> AddThreadAsync(Domain.Entities.Forum.Thread thread)
    {
        await _dbContext.Threads.AddAsync(thread);
        await _dbContext.SaveChangesAsync();
        return thread.Id.ToString();
    }

    public async Task<Domain.Entities.Forum.Thread?> GetThreadByIdAsync(ObjectId threadId)
    {
        return await _dbContext.Threads
            .FirstOrDefaultAsync(t => t.Id == threadId);
    }

    public async Task<Domain.Entities.Forum.Thread?> GetActiveThreadByIdAsync(ObjectId threadId)
    {
        return await _dbContext.Threads
            .FirstOrDefaultAsync(t => t.Id == threadId && t.IsActive);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
