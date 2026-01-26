using CEZ3._0.Application.Interfaces;
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

namespace CEZ3._0.Application.LessonAttachments.Command.AddLessonAttachment
{
    public class AddLessonAttachmentCommandHandler(
    ILessonAttachmentRepository attachmentRepository,
    ISectionMaterialRepository materialRepository,
    ICourseSectionRepository sectionRepository,
    ICourseRepository courseRepository,
    IUserContext userContext) : IRequestHandler<AddLessonAttachmentCommand, string>
    {
        public async Task<string> Handle(AddLessonAttachmentCommand request, CancellationToken cancellationToken)
        {
            var currentUser = userContext.GetCurrentUser()
                 ?? throw new UnauthorizedException("User must be logged in.");

            if (!ObjectId.TryParse(request.LessonId, out var lessonId))
                throw new BadRequestException("Invalid Lesson ID format.");

            var lesson = await materialRepository.GetByIdAsync(lessonId)
                ?? throw new BadRequestException("Lesson not found.");

            var section = await sectionRepository.GetByIdAsync(lesson.SectionId)
                ?? throw new BadRequestException("Section not found.");

            var course = await courseRepository.GetByIdAsync(section.CourseId)
                ?? throw new BadRequestException("Course not found.");

            var isOwner = course.OwnerId.ToString() == currentUser.id;
            var isAdmin = currentUser.role == UserRoles.Admin.ToString();

            if (!isOwner && !isAdmin)
                throw new ForbiddenException("You don't have permission to add attachments to this lesson.");

            var attachment = new LessonAttachment
            {
                Id = ObjectId.GenerateNewId(),
                SectionMaterialId = lessonId,
                FileName = request.FileName,
                FileUrl = request.FileUrl,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow
            };

            await attachmentRepository.AddAsync(attachment);

            return attachment.Id.ToString();
        }
    }
}
