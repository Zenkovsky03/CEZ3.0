using MediatR;

namespace CEZ3._0.Application.CourseSections.Command.CreateCourseSection;

public class CreateCourseSectionCommand : IRequest<string>
{
    public string CourseId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}
