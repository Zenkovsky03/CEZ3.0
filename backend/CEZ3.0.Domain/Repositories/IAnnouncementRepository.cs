using CEZ3._0.Domain.Entities.Calendar;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IAnnouncementRepository
{
    public Task<ObjectId> CreateAnnouncementAsync(Announcement announcement);
    public Task AddAnnouncementReciversAsync(List<UserAnnouncement> userAnnouncements);
    public Task<Announcement?> GetById(ObjectId announcementId);
    public Task<List<Announcement>> GetAnnouncementsAsync(int pageNumber, int pageSize, ObjectId userId);
    public Task<int> GetTotalAnnouncementsCountAsync(ObjectId userId);
}
