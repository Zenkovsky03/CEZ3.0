using CEZ3._0.Domain.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface IGradeRepository
    {
        Task<Grade?> GetByIdAsync(ObjectId id);
        Task CreateAsync(Grade grade);
        Task<IEnumerable<Grade>> GetByUserIdAsync(ObjectId userId);
        Task<IEnumerable<Grade>> GetByAssignmentIdAsync(ObjectId assignmentId);
    }
}
