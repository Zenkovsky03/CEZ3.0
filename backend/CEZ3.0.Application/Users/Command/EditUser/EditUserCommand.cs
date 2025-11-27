using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Users.Command.EditUser
{
    public class EditUserCommand : IRequest
    {
        public string UserId { get; set; } = default!;
        [Required]
        [MaxLength(50)]
        public string? FirstName { get; set; }
        [Required]
        [MaxLength(50)]
        public string? LastName { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(50)]
        public string? Email { get; set; }
    }
}
