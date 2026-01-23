namespace CEZ3._0.Application.CourseSections.Command.EditCourseSection;

public class EditCourseSectionRequest
{
    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }
}
