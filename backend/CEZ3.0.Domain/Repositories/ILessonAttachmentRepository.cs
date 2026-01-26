using CEZ3._0.Domain.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface ILessonAttachmentRepository
    {
        Task AddAsync(LessonAttachment attachment);
        Task DeleteAsync(LessonAttachment attachment);
        Task<LessonAttachment?> GetByIdAsync(ObjectId id);
        Task<IEnumerable<LessonAttachment>> GetAllByLessonIdAsync(ObjectId lessonId);
        Task SaveChangesAsync();
    }
}
