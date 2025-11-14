using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Command.CreateUser
{
    public class CreateUserCommand : IRequest
    {
        [MaxLength(50)]
        public string FirstName { get; set; } = default!;
        [MaxLength(50)]
        public string LastName { get; set; } = default!;
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = default!;
        [Required]
        [EmailAddress]
        [MaxLength(50)]
        public string Email { get; set; } = default!;
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = default!;
    }
}
