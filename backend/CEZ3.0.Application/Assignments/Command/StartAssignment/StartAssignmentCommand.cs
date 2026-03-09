using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.StartAssignment
{
    public class StartAssignmentCommand : IRequest<string>
    {
        public string AssignmentId { get; set; } = default!;
    }
}
