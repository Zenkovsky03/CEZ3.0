using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.SectionMaterials.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.SectionMaterials.Query.GetSectionMaterialById;

public class GetSectionMaterialByIdQueryHandler(ILogger<GetSectionMaterialByIdQueryHandler> logger,
    IUserContext userContext,
    ISectionMaterialRepository sectionMaterialRepository) : IRequestHandler<GetSectionMaterialByIdQuery, SectionMaterialDto>
{
    private readonly ILogger<GetSectionMaterialByIdQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ISectionMaterialRepository _sectionMaterialRepository = sectionMaterialRepository;

    public async Task<SectionMaterialDto> Handle(GetSectionMaterialByIdQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetSectionMaterialByIdQuery for Id: {Id}", request.Id);

        var user = _userContext.GetCurrentUser();
        if (user == null)
        {
            _logger.LogWarning("Unauthorized access attempt to GetCourseSectionByIdQuery");
            throw new UnauthorizedAccessException("User must be authenticated to access course section details.");
        }

        var id = ObjectId.TryParse(request.Id, out var objectId) ? objectId : throw new BadRequestException("Invalid CourseSectionId format.");

        var sectionMaterial = await _sectionMaterialRepository.GetByIdAsync(id);

        if (sectionMaterial == null)
        {
            _logger.LogWarning("CourseSection with Id: {Id} not found", request.Id);
            throw new NotFoundException($"CourseSection with Id {request.Id} not found.");
        }

        var dto = new SectionMaterialDto
        {
            Id = sectionMaterial.Id,
            SectionId = sectionMaterial.SectionId,
            Title = sectionMaterial.Title,
            Content = sectionMaterial.Content,
            MaterialType = sectionMaterial.MaterialType,
            CreatedAt = sectionMaterial.CreatedAt
        };

        return dto;
    }
}
