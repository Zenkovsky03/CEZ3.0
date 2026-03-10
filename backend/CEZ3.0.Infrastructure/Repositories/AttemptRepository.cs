using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Infrastructure.Repositories
{
    public class AttemptRepository(CezDbContext dbContext) : IAttemptRepository
    {
        private readonly CezDbContext _dbContext = dbContext;

        public async Task<StudentAssignmentAttempt?> GetByIdAsync(ObjectId id)
        {
            return await _dbContext.Attempts
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<StudentAssignmentAttempt?> GetActiveAttemptAsync(ObjectId studentId, ObjectId assignmentId)
        {
            return await _dbContext.Attempts
                .FirstOrDefaultAsync(a => a.StudentId == studentId && a.AssignmentId == assignmentId && !a.IsCompleted);
        }

        public async Task CreateAsync(StudentAssignmentAttempt attempt)
        {
            await _dbContext.Attempts.AddAsync(attempt);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(StudentAssignmentAttempt attempt)
        {
            _dbContext.Attempts.Update(attempt);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateSelectionAsync(ObjectId attemptId, ObjectId questionId, List<ObjectId> selectedAnswerIds)
        {
            var attempt = await _dbContext.Attempts.FirstOrDefaultAsync(a => a.Id == attemptId);
            if (attempt != null)
            {                attempt.Selections.RemoveAll(s => s.QuestionId == questionId);
                attempt.Selections.Add(new StudentSelection
                {
                    QuestionId = questionId,
                    SelectedAnswerIds = selectedAnswerIds
                });

                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<StudentAssignmentAttempt>> GetResultsByAssignmentIdAsync(ObjectId assignmentId)
        {
            return await _dbContext.Attempts
                .Where(a => a.AssignmentId == assignmentId)
                .ToListAsync();
        }
    }
}
