using CEZ3._0.Application.CourseSections.Dtos;
using MediatR;

namespace CEZ3._0.Application.CourseSections.Query.GetCourseSectionById;

public class GetCourseSectionByIdQuery : IRequest<CourseSectionDto>
{
    public string CourseSectionId { get; set; } = string.Empty;

    public GetCourseSectionByIdQuery(string courseSectionId)
    {
        CourseSectionId = courseSectionId;
    }
}
