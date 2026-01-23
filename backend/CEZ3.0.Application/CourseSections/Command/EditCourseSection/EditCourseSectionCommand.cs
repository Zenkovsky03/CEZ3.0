using MediatR;

namespace CEZ3._0.Application.CourseSections.Command.EditCourseSection;

public class EditCourseSectionCommand : IRequest<string>
{
    public string CourseSectionId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }
}
