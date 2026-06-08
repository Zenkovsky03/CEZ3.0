using CEZ3._0.Application.SectionMaterials.Dtos;
using MediatR;

namespace CEZ3._0.Application.SectionMaterials.Query.GetSectionMaterialsBySectionId;

public class GetSectionMaterialsBySectionIdQuery : IRequest<List<SectionMaterialDto>>
{
    public string SectionId { get; set; }

    public GetSectionMaterialsBySectionIdQuery(string sectionId)
    {
        SectionId = sectionId;
    }
}
