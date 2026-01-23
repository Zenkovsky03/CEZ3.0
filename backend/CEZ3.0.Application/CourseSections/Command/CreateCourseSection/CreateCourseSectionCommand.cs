using MediatR;

namespace CEZ3._0.Application.CourseSections.Command.CreateCourseSection;

public class CreateCourseSectionCommand : IRequest<string>
{
    public string CourseId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }
}
