using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        public UserRepository(CezDbContext dbContext) 
        { 
            _dbContext = dbContext;
        }
        private readonly CezDbContext _dbContext;
        public Task<Domain.Entities.User?> GetUserByLoginAsync(string login)
        {
            return _dbContext.Users.FirstOrDefaultAsync(u => u.Username == login);
        }

        public Task<Domain.Entities.User?> GetUserByEmailAsync(string email)
        {
            return _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(Domain.Entities.User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}
