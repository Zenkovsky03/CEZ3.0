using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<Domain.Entities.User?> GetUserByLoginAsync(string login);
        Task<Domain.Entities.User?> GetUserByEmailAsync(string email);
        Task AddUserAsync(Domain.Entities.User user);
    }
}
