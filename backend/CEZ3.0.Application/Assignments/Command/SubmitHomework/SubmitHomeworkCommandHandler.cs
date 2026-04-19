using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Command.SubmitHomework
{
    public class SubmitHomeworkCommandHandler(
    IAssignmentRepository assignmentRepository,
    IAttemptRepository attemptRepository,
    IUserContext userContext) : IRequestHandler<SubmitHomeworkCommand>
    {
        public async Task Handle(SubmitHomeworkCommand request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired");
            var studentId = ObjectId.Parse(user.id);
            var assignmentId = ObjectId.Parse(request.AssignmentId);

            var assignment = await assignmentRepository.GetByIdAsync(assignmentId)
                ?? throw new BadRequestException("Assignment not found");

            var attempt = await attemptRepository.GetAnyAttemptAsync(studentId, assignmentId);

            if (attempt != null && attempt.IsCompleted)
                throw new BadRequestException("This homework has already been submitted.");

            if (attempt == null)
            {
                attempt = new StudentAssignmentAttempt
                {
                    Id = ObjectId.GenerateNewId(),
                    AssignmentId = assignmentId,
                    StudentId = studentId,
                    StartedAt = DateTime.UtcNow
                };
                attempt.SubmissionText = request.SubmissionText;
                attempt.AttachmentUrl = request.AttachmentUrl;
                attempt.FinishedAt = DateTime.UtcNow;
                attempt.IsCompleted = true;
                await attemptRepository.CreateAsync(attempt);
            }
            else
            {
                attempt.SubmissionText = request.SubmissionText;
                attempt.AttachmentUrl = request.AttachmentUrl;
                attempt.FinishedAt = DateTime.UtcNow;
                attempt.IsCompleted = true;
                await attemptRepository.UpdateAsync(attempt);
            }
        }
    }
}
