using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
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

namespace CEZ3._0.Application.Assignments.Command.CreateAssignment
{
    public class CreateAssignmentCommandHandler(
        ILogger<CreateAssignmentCommandHandler> logger,
        IUserContext userContext,
        ICourseRepository courseRepository,
        IAssignmentRepository assignmentRepository) : IRequestHandler<CreateAssignmentCommand, string>
    {
        public async Task<string> Handle(CreateAssignmentCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Creating assignment '{Title}' for Course {CourseId}", request.Title, request.CourseId);

            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in.");

            if (currentUser.role != UserRoles.Teacher.ToString() && currentUser.role != UserRoles.Admin.ToString())
                throw new ForbiddenException("Only Teachers or Admins can create assignments.");

            if (!ObjectId.TryParse(request.CourseId, out var courseId))
                throw new BadRequestException("Invalid Course ID format.");

            var course = await courseRepository.GetByIdAsync(courseId)
                ?? throw new BadRequestException("Course not found.");

            if (currentUser.role == UserRoles.Teacher.ToString() && course.OwnerId.ToString() != currentUser.id)
                throw new ForbiddenException("You are not the owner of this course.");

            var assignment = new Assignment
            {
                Id = ObjectId.GenerateNewId(),
                CourseId = courseId,
                SectionId = ObjectId.TryParse(request.SectionId, out var sId) ? sId : ObjectId.Empty,
                Title = request.Title,
                Description = request.Description,
                TaskType = request.TaskType,
                CreatedAt = DateTime.UtcNow,
                IsAutoGraded = true,
                MaxPoint = request.Questions.Sum(q => q.Points),

                Questions = request.Questions.Select(q => new QuizQuestion
                {
                    Id = ObjectId.GenerateNewId(), 
                    Text = q.Text,
                    Type = q.Type,
                    Points = q.Points,
                    Answers = q.Answers.Select(a => new QuizAnswer
                    {
                        Id = ObjectId.GenerateNewId(),
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            await assignmentRepository.CreateAsync(assignment);

            logger.LogInformation("Assignment {AssignmentId} created successfully.", assignment.Id);

            return assignment.Id.ToString();
        }
    }
}
