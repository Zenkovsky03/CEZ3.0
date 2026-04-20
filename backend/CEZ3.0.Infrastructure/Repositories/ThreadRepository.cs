using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;

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
}
