using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.FinishQuiz
{
    public class FinishQuizCommand : IRequest<QuizResultDto>
    {
        public ObjectId AttemptId { get; set; } 
    }
}

public record QuizResultDto(int Score, int MaxPoints, string TaskType);