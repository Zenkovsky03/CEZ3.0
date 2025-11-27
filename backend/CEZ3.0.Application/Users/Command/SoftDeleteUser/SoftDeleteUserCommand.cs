using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Command.SoftDeleteUser
{
    public class SoftDeleteUserCommand : IRequest
    {
        [Required]
        public string UserId { get; set; } = default!;
    }
}
