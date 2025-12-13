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

namespace CEZ3._0.Application.Courses.Command.SoftDeleteCourse
{
    public class SoftDeleteCourseCommandHandler(ILogger<SoftDeleteCourseCommandHandler> logger,
        ICourseRepository courseRepository,
        IUserContext userContext) : IRequestHandler<SoftDeleteCourseCommand>
    {
        private readonly ICourseRepository _courseRepository = courseRepository;
        private readonly ILogger<SoftDeleteCourseCommandHandler> _logger = logger;
        private readonly IUserContext _userContext = userContext;
        public async Task Handle(SoftDeleteCourseCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to delete a course.");

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
                _logger.LogWarning("User {UserId} attempted to delete course {CourseId} without permission.",
                    currentUser.id, request.CourseId);
                throw new ForbiddenException("You don't have permission to delete this course.");
            }

            course.Archived = true;

            await _courseRepository.SaveChangesAsync();

            _logger.LogInformation("Course {CourseId} soft deleted by user {UserId}", request.CourseId, currentUser.id);
        }
    }
}
