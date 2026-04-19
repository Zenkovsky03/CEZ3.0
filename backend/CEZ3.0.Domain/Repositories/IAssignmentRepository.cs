using CEZ3._0.Domain.Entities;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface IAssignmentRepository
{
    Task<Assignment?> GetByIdAsync(ObjectId id);
    Task<IEnumerable<Assignment>> GetByCourseIdAsync(ObjectId courseId);
    Task CreateAsync(Assignment assignment);
    Task UpdateAsync(Assignment assignment);
    Task DeleteAsync(ObjectId id);
    Task<List<Assignment>> GetNearestAssignmentsForUserAsync(ObjectId userId, List<ObjectId> enr);
}
