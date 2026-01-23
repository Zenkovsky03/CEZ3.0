using MediatR;

namespace CEZ3._0.Application.CourseSections.Command.DeleteCourseSection;

public class DeleteCourseSectionCommand : IRequest
{
    public string CourseSectionId { get; set; } = default!;
}
