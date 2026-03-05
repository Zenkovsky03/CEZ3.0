using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Repositories;

public class AnnouncementRepository : IAnnouncementRepository
{
    private readonly CezDbContext _dbContext;

    public AnnouncementRepository(CezDbContext dbContext) 
    {
        _dbContext = dbContext;
    }

    public async Task<ObjectId> CreateAnnouncementAsync(Announcement announcement)
    {
        await _dbContext.Announcements.AddAsync(announcement);
        await _dbContext.SaveChangesAsync();
        return announcement.Id;
    }

    public async Task AddAnnouncementReciversAsync(List<UserAnnouncement> userAnnouncements)
    {
        await _dbContext.UserAnnouncements.AddRangeAsync(userAnnouncements);
        await _dbContext.SaveChangesAsync();
    }

}
