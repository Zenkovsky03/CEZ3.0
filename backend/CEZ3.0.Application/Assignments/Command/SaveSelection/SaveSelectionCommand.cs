using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.SaveSelection
{
    public class SaveSelectionCommand : IRequest
    {
        public string AttemptId { get; set; } = default!;
        public string QuestionId { get; set; } = default!;
        public List<string> SelectedAnswerIds { get; set; } = new();
    }
}
