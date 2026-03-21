using CEZ3._0.Application.SectionMaterials.Dtos;
using MediatR;

namespace CEZ3._0.Application.SectionMaterials.Query.GetSectionMaterialById;

public class GetSectionMaterialByIdQuery : IRequest<SectionMaterialDto>
{
    public string Id { get; set; } = string.Empty;

    public GetSectionMaterialByIdQuery(string id)
    {
        Id = id;
    }
}
