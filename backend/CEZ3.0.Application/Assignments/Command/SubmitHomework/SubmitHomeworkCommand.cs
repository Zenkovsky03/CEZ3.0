using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.SubmitHomework
{
    public class SubmitHomeworkCommand : IRequest
    {
        public string AssignmentId { get; set; } = default!;
        public string? SubmissionText { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
