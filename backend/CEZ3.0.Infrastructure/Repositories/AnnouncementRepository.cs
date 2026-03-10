using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
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

    public async Task<Announcement?> GetById(ObjectId announcementId)
    {
        return await _dbContext.Announcements.FirstOrDefaultAsync(a => a.Id == announcementId);
    }

    public async Task<List<Announcement>> GetAnnouncementsAsync(int pageNumber, int pageSize, ObjectId userId)
    {
        var query = _dbContext.UserAnnouncements
                    .AsNoTracking()
                    .Where(ua => ua.UserId == userId && ua.IsActive == true)
                    .OrderBy(ua => ua.CreatedAt);

        var userAnnouncements = await (query.Skip((pageNumber - 1) * pageSize).Take(pageSize))
                    .Select(ua => ua.AnnouncementId)
                    .ToListAsync();


        return await _dbContext.Announcements
                    .Where(a => userAnnouncements.Contains(a.Id) && a.IsActive == true)
                    .ToListAsync();
    }

    public async Task<int> GetTotalAnnouncementsCountAsync(ObjectId userId)
    {
        return await _dbContext.UserAnnouncements
                        .AsNoTracking()
                        .Where(ua => ua.UserId == userId && ua.IsActive == true)
                        .CountAsync();
    }
}
