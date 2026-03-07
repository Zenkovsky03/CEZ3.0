using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly CezDbContext _dbContext;
    public EventRepository(CezDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ObjectId> AddEventAsync(Event e)
    {
        await _dbContext.Events.AddAsync(e);
        await _dbContext.SaveChangesAsync();
        return e.Id;
    }

    public async Task AddEventReciversAsync(List<UserEvent> userEvents)
    {
        await _dbContext.UserEvents.AddRangeAsync(userEvents);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Event?> GetByIdAsync(ObjectId id)
    {
        return await _dbContext.Events
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive == true);
    }

    public async Task<List<Event>> GetEventsForUserAsync(ObjectId userId, int pageNumber, int pageSize)
    {
        var query = _dbContext.UserEvents
            .AsNoTracking()
            .Where(ua => ua.UserId == userId && ua.IsActive == true)
            .OrderBy(ua => ua.CreatedAt);

        var userEvents = await (query.Skip((pageNumber - 1) * pageSize).Take(pageSize))
                    .Select(ua => ua.EventId)
                    .ToListAsync();


        return await _dbContext.Events
                    .Where(a => userEvents.Contains(a.Id) && a.IsActive == true)
                    .ToListAsync();
    }

    public async Task<int> GetTotalEventCountForUserAsync(ObjectId userId)
    {

        return await _dbContext.UserEvents
                        .AsNoTracking()
                        .Where(ua => ua.UserId == userId && ua.IsActive == true)
                        .CountAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
