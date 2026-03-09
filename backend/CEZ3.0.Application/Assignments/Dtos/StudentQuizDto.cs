using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Dtos
{
    public record StudentQuizDto(
        string Id,
        string Title,
        string Description,
        List<StudentQuestionDto> Questions);
}
