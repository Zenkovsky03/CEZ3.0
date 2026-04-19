using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Constants.Roles;
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

namespace CEZ3._0.Application.Assignments.Command.GradeHomework
{
    public class GradeHomeworkCommandHandler(
    IAttemptRepository attemptRepository,
    IGradeRepository gradeRepository,
    IUserContext userContext) : IRequestHandler<GradeHomeworkCommand>
    {
        public async Task Handle(GradeHomeworkCommand request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired");

            if (user.role != UserRoles.Teacher.ToString() && user.role != UserRoles.Admin.ToString())
                throw new ForbiddenException("Only teachers can grade assignments.");

            if (!ObjectId.TryParse(request.AttemptId, out var attemptId))
                throw new BadRequestException("Invalid Attempt ID format.");

            var attempt = await attemptRepository.GetByIdAsync(attemptId)
                ?? throw new BadRequestException("Submission not found.");

            if (!attempt.IsCompleted)
                throw new BadRequestException("This assignment attempt is not finished yet.");

            var grade = new Grade
            {
                Id = ObjectId.GenerateNewId(),
                AssignmentId = attempt.AssignmentId,
                UserId = attempt.StudentId,
                PointsRecieved = request.Points,
                Mark = request.Mark,
                Feedback = request.Feedback,
                GradedById = ObjectId.Parse(user.id),
                CreatedAt = DateTime.UtcNow
            };

            await gradeRepository.CreateAsync(grade);

            attempt.FinalScore = request.Points;
            await attemptRepository.UpdateAsync(attempt);
        }
    }
}
