using CEZ3._0.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
