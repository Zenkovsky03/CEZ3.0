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

namespace CEZ3._0.Application.Courses.Command.CreateCourse
{
    public class CreateCourseCommandHandler (ILogger<CreateCourseCommandHandler> logger,
        ICourseRepository courseRepository,
        IUserContext userContext) : IRequestHandler<CreateCourseCommand,string>
    {
        private readonly ILogger<CreateCourseCommandHandler> _logger = logger;
        private readonly ICourseRepository _courseRepository = courseRepository;
        private readonly IUserContext _userContext = userContext;
        public async Task<string> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to create a course.");

            if (currentUser.role != UserRoles.Admin.ToString() && currentUser.role != UserRoles.Teacher.ToString())
            {
                _logger.LogWarning("User {UserId} with role {Role} attempted to create a course without permission.",
                    currentUser.id, currentUser.role);
                throw new ForbiddenException("Only Admin and Teacher can create courses.");
            }

            if (request.EndDate <= request.StartDate)
            {
                throw new BadRequestException("End date must be after start date.");
            }

            var existingCourse = await _courseRepository.GetByNameAsync(request.Name);
            if (existingCourse != null)
            {
                throw new BadRequestException($"Course with name '{request.Name}' already exists.");
            }

            if (!ObjectId.TryParse(currentUser.id, out var ownerId))
            {
                throw new BadRequestException("Invalid user ID format.");
            }

            var course = new Course
            {
                Id = ObjectId.GenerateNewId(),
                Name = request.Name,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Archived = false,
                OwnerId = ownerId,
                CreatedAt = DateTime.UtcNow
            };

            await _courseRepository.AddAsync(course);

            _logger.LogInformation("Course '{CourseName}' created by user {UserId}", course.Name, currentUser.id);

            return course.Id.ToString();
        }
    }
}
