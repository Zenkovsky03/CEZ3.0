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
    public class LessonAttachmentRepository : ILessonAttachmentRepository
    {
        private readonly CezDbContext _dbContext;

        public LessonAttachmentRepository(CezDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddAsync(LessonAttachment attachment)
        {
            await _dbContext.LessonAttachments.AddAsync(attachment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(LessonAttachment attachment)
        {
            _dbContext.LessonAttachments.Remove(attachment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<LessonAttachment?> GetByIdAsync(ObjectId id)
        {
            return await _dbContext.LessonAttachments
                .FirstOrDefaultAsync(la => la.Id == id);
        }

        public async Task<IEnumerable<LessonAttachment>> GetAllByLessonIdAsync(ObjectId lessonId)
        {
            return await _dbContext.LessonAttachments
                .Where(la => la.SectionMaterialId == lessonId)
                .OrderByDescending(la => la.CreatedAt)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
