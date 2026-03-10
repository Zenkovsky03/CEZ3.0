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
    public class AssignmentRepository(CezDbContext dbContext) : IAssignmentRepository
    {
        private readonly CezDbContext _dbContext = dbContext;

        public async Task<Assignment?> GetByIdAsync(ObjectId id)
        {
            var objectId = id;
            return await _dbContext.Assignments
                .FirstOrDefaultAsync(a => a.Id == objectId);
        }

        public async Task<IEnumerable<Assignment>> GetByCourseIdAsync(ObjectId courseId)
        {
            return await _dbContext.Assignments
                .Where(a => a.CourseId == courseId)
                .ToListAsync();
        }

        public async Task CreateAsync(Assignment assignment)
        {
            await _dbContext.Assignments.AddAsync(assignment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Assignment assignment)
        {
            _dbContext.Assignments.Update(assignment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(ObjectId id)
        {
            var assignment = await _dbContext.Assignments.FirstOrDefaultAsync(a => a.Id == id);
            if (assignment != null)
            {
                _dbContext.Assignments.Remove(assignment);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
