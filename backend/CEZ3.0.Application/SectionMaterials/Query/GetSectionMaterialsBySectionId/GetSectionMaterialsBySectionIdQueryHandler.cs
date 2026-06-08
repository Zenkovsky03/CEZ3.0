using CEZ3._0.Application.SectionMaterials.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.SectionMaterials.Query.GetSectionMaterialsBySectionId;

public class GetSectionMaterialsBySectionIdQueryHandler(
    ILogger<GetSectionMaterialsBySectionIdQueryHandler> logger,
    ISectionMaterialRepository sectionMaterialRepository)
    : IRequestHandler<GetSectionMaterialsBySectionIdQuery, List<SectionMaterialDto>>
{
    private readonly ILogger<GetSectionMaterialsBySectionIdQueryHandler> _logger = logger;
    private readonly ISectionMaterialRepository _sectionMaterialRepository = sectionMaterialRepository;

    public async Task<List<SectionMaterialDto>> Handle(GetSectionMaterialsBySectionIdQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetSectionMaterialsBySectionIdQuery for SectionId: {SectionId}", request.SectionId);

        var sectionId = ObjectId.TryParse(request.SectionId, out var objectId)
            ? objectId
            : throw new BadRequestException("Invalid SectionId format.");

        var materials = await _sectionMaterialRepository.GetBySectionIdAsync(sectionId);

        return materials.Select(m => new SectionMaterialDto
        {
            Id = m.Id,
            SectionId = m.SectionId,
            Title = m.Title,
            Content = m.Content,
            MaterialType = m.MaterialType,
            CreatedAt = m.CreatedAt
        }).ToList();
    }
}
