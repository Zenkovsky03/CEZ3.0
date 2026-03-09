using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Dtos
{
    public class CreateAnswerDto
    {
        public string Text { get; set; } = default!;
        public bool IsCorrect { get; set; }
    }
}
