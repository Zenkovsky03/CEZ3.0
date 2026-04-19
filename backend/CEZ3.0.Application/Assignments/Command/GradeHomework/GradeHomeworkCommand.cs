using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.GradeHomework
{
    public class GradeHomeworkCommand : IRequest
    {
        public string AttemptId { get; set; } = default!;
        public string StudentId { get; set; } = default!;
        public int Points { get; set; }
        public string? Mark { get; set; }
        public string Feedback { get; set; } = default!;
    }
}
