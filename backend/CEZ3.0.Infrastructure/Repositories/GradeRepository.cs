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
    public class GradeRepository(CezDbContext dbContext) : IGradeRepository
    {
        private readonly CezDbContext _dbContext = dbContext;

        public async Task<Grade?> GetByIdAsync(ObjectId id)
        {
            return await _dbContext.Grades.FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task CreateAsync(Grade grade)
        {
            await _dbContext.Grades.AddAsync(grade);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Grade>> GetByUserIdAsync(ObjectId userId)
        {
            return await _dbContext.Grades.Where(g => g.UserId == userId).ToListAsync();
        }

        public async Task<IEnumerable<Grade>> GetByAssignmentIdAsync(ObjectId assignmentId)
        {
            return await _dbContext.Grades.Where(g => g.AssignmentId == assignmentId).ToListAsync();
        }

        public async Task<bool> ExistsAsync(ObjectId assignmentId, ObjectId userId)
        {
            return await _dbContext.Grades
                .AnyAsync(g => g.AssignmentId == assignmentId && g.UserId == userId);
        }
    }
}
