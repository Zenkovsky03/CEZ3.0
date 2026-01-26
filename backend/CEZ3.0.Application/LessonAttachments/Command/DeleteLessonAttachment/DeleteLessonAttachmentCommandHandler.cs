using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.LessonAttachments.Command.DeleteLessonAttachment
{
    public class DeleteLessonAttachmentCommandHandler(
    ILessonAttachmentRepository attachmentRepository,
    ISectionMaterialRepository materialRepository,
    ICourseSectionRepository sectionRepository,
    ICourseRepository courseRepository,
    IUserContext userContext) : IRequestHandler<DeleteLessonAttachmentCommand>
    {
        public async Task Handle(DeleteLessonAttachmentCommand request, CancellationToken cancellationToken)
        {
            var currentUser = userContext.GetCurrentUser()
                 ?? throw new UnauthorizedException("User must be logged in.");

            if (!ObjectId.TryParse(request.AttachmentId, out var attachmentId))
                throw new BadRequestException("Invalid Attachment ID format.");

            var attachment = await attachmentRepository.GetByIdAsync(attachmentId)
                ?? throw new BadRequestException("Attachment not found.");

            var lesson = await materialRepository.GetByIdAsync(attachment.SectionMaterialId);
            if (lesson == null) throw new BadRequestException("Parent lesson not found.");

            var section = await sectionRepository.GetByIdAsync(lesson.SectionId);
            if (section == null) throw new BadRequestException("Parent section not found.");

            var course = await courseRepository.GetByIdAsync(section.CourseId);
            if (course == null) throw new BadRequestException("Course not found.");

            var isOwner = course.OwnerId.ToString() == currentUser.id;
            var isAdmin = currentUser.role == UserRoles.Admin.ToString();

            if (!isOwner && !isAdmin)
                throw new ForbiddenException("You don't have permission to delete this attachment.");

            await attachmentRepository.DeleteAsync(attachment);
        }
    }
}
