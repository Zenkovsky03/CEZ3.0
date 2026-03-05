using CEZ3._0.Domain.Entities.Calendar;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IAnnouncementRepository
{
    public Task<ObjectId> CreateAnnouncementAsync(Announcement announcement);
}
