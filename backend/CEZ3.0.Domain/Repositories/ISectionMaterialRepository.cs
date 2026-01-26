using CEZ3._0.Domain.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface ISectionMaterialRepository
    {
        Task<SectionMaterial?> GetByIdAsync(ObjectId id);
        Task AddAsync(SectionMaterial material);
        Task UpdateAsync(SectionMaterial material);
        Task DeleteAsync(SectionMaterial material);
        Task SaveChangesAsync();
    }
}
