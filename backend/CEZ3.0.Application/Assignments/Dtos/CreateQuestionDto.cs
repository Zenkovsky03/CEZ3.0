using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Dtos
{
    public class CreateQuestionDto
    {
        public string Text { get; set; } = default!;
        public string Type { get; set; } = default!;
        public int Points { get; set; }
        public List<CreateAnswerDto> Answers { get; set; } = new();
    }
}
