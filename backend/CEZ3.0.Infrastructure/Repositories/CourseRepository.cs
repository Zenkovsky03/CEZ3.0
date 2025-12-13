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
    public class CourseRepository : ICourseRepository
    {
        public CourseRepository(CezDbContext dbContext) 
        {
            _dbContext = dbContext;
        }
        private readonly CezDbContext _dbContext;

        public async Task<Course?> GetByIdAsync(ObjectId id)
        {
            return await _dbContext.Courses
                .FirstOrDefaultAsync(c => c.Id == id && !c.Archived);
        }

        public async Task<Course?> GetByNameAsync(string name)
        {
            return await _dbContext.Courses
                .FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower() && !c.Archived);
        }

        public async Task<IEnumerable<Course>> GetAllAsync(bool includeDeleted = false)
        {
            var query = _dbContext.Courses.AsQueryable();

            if (!includeDeleted)
                query = query.Where(c => !c.Archived);

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Course>> GetByOwnerIdAsync(ObjectId ownerId)
        {
            return await _dbContext.Courses
                .Where(c => c.OwnerId == ownerId && !c.Archived)
                .ToListAsync();
        }

        public async Task AddAsync(Course course)
        {
            await _dbContext.Courses.AddAsync(course);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Course course)
        {
            _dbContext.Courses.Update(course);
            await _dbContext.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
