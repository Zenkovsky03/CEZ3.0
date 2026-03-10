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

namespace CEZ3._0.Application.Assignments.Query.GetAssignmentResults
{
    public class GetAssignmentResultsQueryHandler(
        ILogger<GetAssignmentResultsQueryHandler> logger,
        IAttemptRepository attemptRepository,
        IAssignmentRepository assignmentRepository) : IRequestHandler<GetAssignmentResultsQuery, List<AssignmentResultDto>>
    {
        public async Task<List<AssignmentResultDto>> Handle(GetAssignmentResultsQuery request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Fetching results for assignment: {AssignmentId}", request.AssignmentId);

            if (!ObjectId.TryParse(request.AssignmentId, out var assignmentId))
                throw new BadRequestException("Invalid Assignment ID format.");

            var assignment = await assignmentRepository.GetByIdAsync(assignmentId)
                ?? throw new BadRequestException("Assignment not found.");

            var attempts = await attemptRepository.GetResultsByAssignmentIdAsync(assignmentId);

            return attempts.Select(a => new AssignmentResultDto(
                a.Id.ToString(),
                a.StudentId.ToString(),
                a.FinalScore,
                assignment.MaxPoint,
                a.IsCompleted,
                a.StartedAt,
                a.FinishedAt
            )).ToList();
        }
    }
}
