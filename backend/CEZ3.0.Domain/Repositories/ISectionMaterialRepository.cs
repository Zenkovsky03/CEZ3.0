using CEZ3._0.Domain.Entities;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface ISectionMaterialRepository
{
    Task<SectionMaterial?> GetByIdAsync(ObjectId id);
    Task<SectionMaterial?> GetNewestByCourseSectionId(ObjectId courseSectionId);
    Task<List<SectionMaterial>> GetBySectionIdAsync(ObjectId sectionId);
    Task AddAsync(SectionMaterial material);
    Task UpdateAsync(SectionMaterial material);
    Task DeleteAsync(SectionMaterial material);
    Task SaveChangesAsync();
}
