using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
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

namespace CEZ3._0.Application.Courses.Command.EditCourse
{
    public class EditCourseCommandHandler(ILogger<EditCourseCommandHandler> logger,
        ICourseRepository courseRepository,
        IUserContext userContext) : IRequestHandler<EditCourseCommand>
    {
        private readonly ICourseRepository _courseRepository = courseRepository;
        private readonly ILogger<EditCourseCommandHandler> _logger = logger;
        private readonly IUserContext _userContext = userContext;

        public async Task Handle(EditCourseCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to edit a course.");

            if (!ObjectId.TryParse(request.CourseId, out var courseId))
            {
                _logger.LogWarning("Invalid CourseId format: {CourseId}", request.CourseId);
                throw new BadRequestException("Invalid course ID format.");
            }

            var course = await _courseRepository.GetByIdAsync(courseId)
                ?? throw new BadRequestException("Course not found.");

            var isAdmin = currentUser.role == UserRoles.Admin.ToString();
            var isOwner = course.OwnerId.ToString() == currentUser.id;

            if (!isAdmin && !isOwner)
            {
                _logger.LogWarning("User {UserId} attempted to edit course {CourseId} without permission.",
                    currentUser.id, request.CourseId);
                throw new ForbiddenException("You don't have permission to edit this course.");
            }

            if (!string.IsNullOrEmpty(request.Name) && request.Name != course.Name)
            {
                var existingCourse = await _courseRepository.GetByNameAsync(request.Name);
                if (existingCourse != null)
                {
                    throw new BadRequestException($"Course with name '{request.Name}' already exists.");
                }
            }

            course.Name = request.Name;
            if (request.Description != null)
                course.Description = request.Description;
            course.StartDate = request.StartDate;
            course.EndDate = request.EndDate;

            if (course.EndDate <= course.StartDate)
            {
                throw new BadRequestException("End date must be after start date.");
            }

            await _courseRepository.SaveChangesAsync();

            _logger.LogInformation("Course {CourseId} updated by user {UserId}", request.CourseId, currentUser.id);
        }
    }
}
