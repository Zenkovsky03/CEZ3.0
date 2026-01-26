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

namespace CEZ3._0.Application.SectionMaterials.Command.EditSectionMaterial
{
    public class EditSectionMaterialCommandHandler(
        ISectionMaterialRepository sectionMaterialRepository,
        ICourseSectionRepository sectionRepository,
        ICourseRepository courseRepository,
        IUserContext userContext) : IRequestHandler<EditSectionMaterialCommand>
    {
        private readonly ISectionMaterialRepository _sectionMaterialRepository = sectionMaterialRepository;
        private readonly ICourseSectionRepository _sectionRepository = sectionRepository;
        private readonly ICourseRepository _courseRepository = courseRepository;
        private readonly IUserContext _userContext = userContext;
        public async Task Handle(EditSectionMaterialCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in.");

            if (!ObjectId.TryParse(request.Id, out var materialId))
                throw new BadRequestException("Invalid Lesson ID format.");

            var material = await _sectionMaterialRepository.GetByIdAsync(materialId)
                ?? throw new BadRequestException("Lesson not found.");

            var section = await _sectionRepository.GetByIdAsync(material.SectionId)
                ?? throw new BadRequestException("Section not found.");

            var course = await _courseRepository.GetByIdAsync(section.CourseId)
                ?? throw new BadRequestException("Course not found.");

            var isOwner = course.OwnerId.ToString() == currentUser.id;
            var isAdmin = currentUser.role == UserRoles.Admin.ToString();

            if (!isOwner && !isAdmin)
                throw new ForbiddenException("You don't have permission to edit this lesson.");

            if (!string.IsNullOrEmpty(request.Title))
                material.Title = request.Title;

            if (request.Content != null)
                material.Content = request.Content;

            await _sectionMaterialRepository.UpdateAsync(material);
        }
    }
}
