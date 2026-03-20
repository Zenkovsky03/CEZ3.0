using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Repositories;

public class CourseSectionRepository : ICourseSectionRepository
{
    private readonly CezDbContext _cezDbContext;

    public CourseSectionRepository(CezDbContext cezDbContext)
    {
        _cezDbContext = cezDbContext;
    }

    public async Task AddSectionAsync(CourseSection courseSection)
    {
        await _cezDbContext.AddAsync(courseSection);
        await _cezDbContext.SaveChangesAsync();
    }

    public async Task<CourseSection?> GetByIdAsync(ObjectId id)
    {
        return await _cezDbContext.CourseSections
            .FirstOrDefaultAsync(s => s.Id == id && s.IsActive);
    }

    public async Task<List<CourseSection>> GetCourseSectionsByCourseIdAsync(ObjectId courseId)
    {
        return await _cezDbContext.CourseSections
            .Where(s => s.CourseId == courseId && s.IsActive)
            .OrderBy(s => s.OrderIndex)
            .ToListAsync();
    }

    public async Task NormalizeOrderAsync()
    {
        var sections = await _cezDbContext.CourseSections
            .Where(s => s.IsActive)
            .OrderBy(s => s.OrderIndex)
            .ToListAsync();

        for (int i = 0; i < sections.Count; i++)
        {
            sections[i].OrderIndex = i;
        }

        await _cezDbContext.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _cezDbContext.SaveChangesAsync();
    }
}
