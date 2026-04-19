using CEZ3._0.Domain.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface IAttemptRepository
    {
        Task<StudentAssignmentAttempt?> GetByIdAsync(ObjectId id);
        Task<StudentAssignmentAttempt?> GetActiveAttemptAsync(ObjectId studentId, ObjectId assignmentId);
        Task CreateAsync(StudentAssignmentAttempt attempt);
        Task UpdateAsync(StudentAssignmentAttempt attempt);
        Task UpdateSelectionAsync(ObjectId attemptId, ObjectId questionId, List<ObjectId> selectedAnswerIds);
        Task<IEnumerable<StudentAssignmentAttempt>> GetResultsByAssignmentIdAsync(ObjectId assignmentId);
        Task<StudentAssignmentAttempt?> GetAnyAttemptAsync(ObjectId studentId, ObjectId assignmentId);
    }
}
