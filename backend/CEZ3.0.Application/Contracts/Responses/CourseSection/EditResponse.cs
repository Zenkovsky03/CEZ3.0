namespace CEZ3._0.Application.Contracts.Responses.CourseSection;

public class EditResponse
{
    public string Message { get; set; } = "Course section edited successfully.";
    public string CourseSectionId { get; set; } = default!;
}
