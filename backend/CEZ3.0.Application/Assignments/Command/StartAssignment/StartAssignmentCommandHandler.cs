using CEZ3._0.Application.Interfaces;
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

namespace CEZ3._0.Application.Assignments.Command.StartAssignment
{
    public class StartAssignmentCommandHandler(
        ILogger<StartAssignmentCommandHandler> logger,
        IUserContext userContext,
        IAssignmentRepository assignmentRepository,
        IAttemptRepository attemptRepository) : IRequestHandler<StartAssignmentCommand, string>
    {
        public async Task<string> Handle(StartAssignmentCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("User is attempting to start assignment: {AssignmentId}", request.AssignmentId);

            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in.");

            if (!ObjectId.TryParse(currentUser.id, out var studentId))
                throw new UnauthorizedException("Invalid User ID.");

            if (!ObjectId.TryParse(request.AssignmentId, out var assignmentId))
                throw new BadRequestException("Invalid Assignment ID format.");

            var assignment = await assignmentRepository.GetByIdAsync(assignmentId)
                ?? throw new BadRequestException("Assignment not found.");

            var activeAttempt = await attemptRepository.GetActiveAttemptAsync(studentId, assignmentId);

            if (activeAttempt != null)
            {
                logger.LogInformation("Returning existing active attempt: {AttemptId}", activeAttempt.Id);
                return activeAttempt.Id.ToString();
            }

            // TODO: Tutaj można dodać sprawdzenie, czy uczeń nie przekroczył limitu podejść 
            // (jeśli planujesz taką funkcjonalność w przyszłości)

            var newAttempt = new StudentAssignmentAttempt
            {
                Id = ObjectId.GenerateNewId(),
                AssignmentId = assignmentId,
                StudentId = studentId,
                StartedAt = DateTime.UtcNow,
                IsCompleted = false,
                Selections = new List<StudentSelection>(),
                FinalScore = 0
            };

            await attemptRepository.CreateAsync(newAttempt);

            logger.LogInformation("New attempt {AttemptId} created for student {StudentId}", newAttempt.Id, studentId);

            return newAttempt.Id.ToString();
        }
    }
}
