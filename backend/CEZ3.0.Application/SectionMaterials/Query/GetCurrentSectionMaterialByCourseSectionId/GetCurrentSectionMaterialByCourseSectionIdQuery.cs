using CEZ3._0.Application.SectionMaterials.Dtos;
using MediatR;

namespace CEZ3._0.Application.SectionMaterials.Query.GetCurrentSectionMaterialByCourseSectionId;

public class GetCurrentSectionMaterialByCourseSectionIdQuery : IRequest<SectionMaterialDto>
{
    public string CourseSectionId { get; set; }

    public GetCurrentSectionMaterialByCourseSectionIdQuery(string courseSectionId)
    {
        CourseSectionId = courseSectionId;
    }
}
