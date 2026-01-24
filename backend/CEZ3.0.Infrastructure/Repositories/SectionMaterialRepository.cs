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
    public class SectionMaterialRepository : ISectionMaterialRepository
    {
        private readonly CezDbContext _dbContext;

        public SectionMaterialRepository(CezDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<SectionMaterial?> GetByIdAsync(ObjectId id)
        {
            return await _dbContext.SectionMaterials
                .FirstOrDefaultAsync(sm => sm.Id == id);
        }

        public async Task AddAsync(SectionMaterial material)
        {
            await _dbContext.SectionMaterials.AddAsync(material);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(SectionMaterial material)
        {
            _dbContext.SectionMaterials.Update(material);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(SectionMaterial material)
        {
            _dbContext.SectionMaterials.Remove(material);
            await _dbContext.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
