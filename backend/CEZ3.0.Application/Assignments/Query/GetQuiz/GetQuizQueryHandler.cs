using CEZ3._0.Application.Assignments.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Query.GetQuiz
{
    public class GetQuizQueryHandler(
        ILogger<GetQuizQueryHandler> logger,
        IAssignmentRepository assignmentRepository,
        IAttemptRepository attemptRepository) : IRequestHandler<GetQuizQuery, StudentQuizDto>
    {
        public async Task<StudentQuizDto> Handle(GetQuizQuery request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Fetching quiz questions for assignment: {Id}", request.AttemptId);

            if (!ObjectId.TryParse(request.AttemptId, out var AttemptId))
            {
                throw new BadRequestException("Invalid Assignment ID format.");
            }

            var attempt = await attemptRepository.GetByIdAsync(AttemptId)
                ?? throw new BadRequestException("Attempt session not found.");

            var assignment = await assignmentRepository.GetByIdAsync(attempt.AssignmentId)
                ?? throw new BadRequestException("Assignment not found.");

            var quizDto = new StudentQuizDto(
                assignment.Id.ToString(),
                assignment.Title,
                assignment.Description,
                assignment.Questions.Select(q => new StudentQuestionDto(
                    q.Id.ToString(),
                    q.Text,
                    q.Type,
                    q.Answers.Select(a => new StudentAnswerDto(
                        a.Id.ToString(),
                        a.Text
                    )).ToList()
                )).ToList()
            );

            return quizDto;
        }
    }
}
