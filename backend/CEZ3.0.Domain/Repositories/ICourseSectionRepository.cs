using CEZ3._0.Domain.Entities;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface ICourseSectionRepository
{
    Task AddSectionAsync(CourseSection courseSection);
    Task NormalizeOrderAsync();
    Task<CourseSection?> GetByIdAsync(ObjectId id);
    Task<List<CourseSection>> GetCourseSectionsByCourseIdAsync(ObjectId courseId);
    Task SaveChangesAsync();
}
