namespace CEZ3._0.Application.Contracts.Responses.CourseSection;

public class CreateResponse
{
    public string Message { get; set; } = "Course section created successfully.";
    public string CourseSectionId { get; set; } = default!;
}
