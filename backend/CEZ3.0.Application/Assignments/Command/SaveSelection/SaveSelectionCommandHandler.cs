using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Services;
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

namespace CEZ3._0.Application.Assignments.Command.SaveSelection
{
    public class SaveSelectionCommandHandler(
        ILogger<SaveSelectionCommandHandler> logger,
        IAttemptRepository attemptRepository,
        IUserContext userContext) : IRequestHandler<SaveSelectionCommand>
    {
        public async Task Handle(SaveSelectionCommand request, CancellationToken cancellationToken)
        {
            if (!ObjectId.TryParse(request.AttemptId, out var attemptId))
                throw new BadRequestException("Invalid Attempt ID format.");

            if (!ObjectId.TryParse(request.QuestionId, out var questionId))
                throw new BadRequestException("Invalid Question ID format.");

            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in.");

            var selectedObjectIds = request.SelectedAnswerIds
                .Select(id => ObjectId.TryParse(id, out var parsedId) ? parsedId : ObjectId.Empty)
                .Where(id => id != ObjectId.Empty)
                .ToList();

            var attempt = await attemptRepository.GetByIdAsync(attemptId)
                ?? throw new BadRequestException("Attempt session not found.");

            if (attempt.StudentId.ToString() != currentUser.id)
                throw new ForbiddenException("You cannot modify attempt of another user.");

            if (attempt.IsCompleted)
            {
                logger.LogWarning("User attempted to save selection for a completed quiz: {AttemptId}", attemptId);
                throw new BadRequestException("Cannot update selections for a finished quiz.");
            }

            await attemptRepository.UpdateSelectionAsync(
                attemptId,
                questionId,
                selectedObjectIds);

            logger.LogDebug("Selection saved for Attempt: {AttemptId}, Question: {QuestionId}", attemptId, questionId);
        }
    }
}
