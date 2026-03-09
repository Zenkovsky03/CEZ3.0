using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Services;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Entities;
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

namespace CEZ3._0.Application.Assignments.Command.FinishQuiz
{
    public class FinishQuizCommandHandler(
        ILogger<FinishQuizCommandHandler> logger,
        IAttemptRepository attemptRepository,
        IAssignmentRepository assignmentRepository,
        IGradeRepository gradeRepository,
        IUserContext userContext) : IRequestHandler<FinishQuizCommand, QuizResultDto>
    {
        public async Task<QuizResultDto> Handle(FinishQuizCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Finishing quiz for Attempt: {AttemptId}", request.AttemptId);
            
            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in.");

            var attempt = await attemptRepository.GetByIdAsync(request.AttemptId)
                ?? throw new BadRequestException("Attempt session not found.");

            if (attempt.StudentId.ToString() != currentUser.id)
                throw new ForbiddenException("You cannot modify attempt of another user.");

            if (attempt.IsCompleted)
                throw new BadRequestException("This quiz has already been finished.");

            var assignment = await assignmentRepository.GetByIdAsync(attempt.AssignmentId)
                ?? throw new BadRequestException("Assignment definition not found.");

            int score = 0;
            foreach (var question in assignment.Questions)
            {
                var selection = attempt.Selections.FirstOrDefault(s => s.QuestionId == question.Id);
                if (selection == null) continue;

                var correctIds = question.Answers
                    .Where(a => a.IsCorrect)
                    .Select(a => a.Id)
                    .ToHashSet();

                var selectedIds = selection.SelectedAnswerIds.ToHashSet();

                if (correctIds.SetEquals(selectedIds))
                {
                    score += question.Points;
                }
            }

            attempt.FinalScore = score;
            attempt.IsCompleted = true;
            attempt.FinishedAt = DateTime.UtcNow;

            await attemptRepository.UpdateAsync(attempt);

            if (assignment.TaskType == "Test")
            {
                var grade = new Grade
                {
                    Id = ObjectId.GenerateNewId(),
                    AssignmentId = assignment.Id,
                    UserId = attempt.StudentId,
                    PointsRecieved = score,
                    CreatedAt = DateTime.UtcNow,
                    Feedback = $"Ocena z testu: {assignment.Title}",
                    Mark = CalculateMark(score, assignment.MaxPoint),
                    GradedById = ObjectId.Empty
                };

                await gradeRepository.CreateAsync(grade);
            }

            return new QuizResultDto(score, assignment.MaxPoint, assignment.TaskType);
        }

        private string CalculateMark(int score, int maxPoints)
        {
            if (maxPoints <= 0) return "1";
            double percentage = (double)score / maxPoints * 100;

            return percentage switch
            {
                >= 90 => "6",
                >= 80 => "5",
                >= 70 => "4",
                >= 50 => "3",
                >= 30 => "2",
                _ => "1"
            };
        }
    }
}
