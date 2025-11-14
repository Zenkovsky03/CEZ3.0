using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Query.LoginUser
{
    public class LoginUserQuery : IRequest<string>
    {
        public string Login { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}
