using CEZ3._0.Domain.Entities.Calendar;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IEventRepository
{
    public Task<ObjectId> AddEventAsync(Event e);
    public Task AddEventReciversAsync(List<UserEvent> userEvents);
    public Task<Event?> GetByIdAsync(ObjectId id);
    public Task<List<Event>> GetEventsForUserAsync(ObjectId userId, int pageNumber, int pageSize);
    public Task<int> GetTotalEventCountForUserAsync(ObjectId userId);
    public Task SaveChangesAsync();
}
