using CEZ3._0.Domain.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface ICourseRepository
    {
        Task<Course?> GetByIdAsync(ObjectId id);
        Task<Course?> GetByNameAsync(string name);
        Task<IEnumerable<Course>> GetAllAsync(bool includeDeleted = false);
        Task<IEnumerable<Course>> GetByOwnerIdAsync(ObjectId ownerId);
        Task AddAsync(Course course);
        Task UpdateAsync(Course course);
        Task SaveChangesAsync();
    }
}
