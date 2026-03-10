using CEZ3._0.Application.Assignments.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.CreateAssignment
{
    public class CreateAssignmentCommand : IRequest<string>
    {
        public string CourseId { get; set; } = default!;
        public string SectionId { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string TaskType { get; set; } = default!; 
        public List<CreateQuestionDto> Questions { get; set; } = new();
    }
}
