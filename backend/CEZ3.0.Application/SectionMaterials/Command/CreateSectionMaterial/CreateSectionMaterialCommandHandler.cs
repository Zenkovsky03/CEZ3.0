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

namespace CEZ3._0.Application.SectionMaterials.Command.CreateSectionMaterial
{
    public class CreateSectionMaterialCommandHandler(ISectionMaterialRepository sectionMaterialRepository,
        ICourseSectionRepository courseSectionRepository,
        ICourseRepository courseRepository,
        IUserContext userContext) : IRequestHandler<CreateSectionMaterialCommand, string>
    {
        private readonly ISectionMaterialRepository _sectionMaterialRepository = sectionMaterialRepository;
        private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;
        private readonly ICourseRepository _courseRepository = courseRepository;
        private readonly IUserContext _userContext = userContext;

        public async Task<string> Handle(CreateSectionMaterialCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
                 ?? throw new UnauthorizedException("User must be logged in.");

            if (!ObjectId.TryParse(request.SectionId, out var sectionId))
                throw new BadRequestException("Invalid Section ID format.");

            var section = await _courseSectionRepository.GetByIdAsync(sectionId)
                ?? throw new BadRequestException("Module (Course Section) not found.");

            var course = await _courseRepository.GetByIdAsync(section.CourseId)
                ?? throw new BadRequestException("Course not found.");

            var isOwner = course.OwnerId.ToString() == currentUser.id;
            var isAdmin = currentUser.role == UserRoles.Admin.ToString();

            if (!isOwner && !isAdmin)
                throw new ForbiddenException("You don't have permission to add lessons to this module.");

            var material = new SectionMaterial
            {
                Id = ObjectId.GenerateNewId(),
                SectionId = sectionId,
                Title = request.Title,
                Content = request.Content,
                MaterialType = request.MaterialType,
                CreatedAt = DateTime.UtcNow
            };

            await _sectionMaterialRepository.AddAsync(material);

            return material.Id.ToString();
        }
    }
}
