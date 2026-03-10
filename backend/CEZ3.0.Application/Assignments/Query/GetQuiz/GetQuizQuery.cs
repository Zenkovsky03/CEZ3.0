using CEZ3._0.Application.Assignments.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Query.GetQuiz
{
    public class GetQuizQuery : IRequest<StudentQuizDto>
    {
        public string AttemptId { get; set; } = default!;
    }
}
