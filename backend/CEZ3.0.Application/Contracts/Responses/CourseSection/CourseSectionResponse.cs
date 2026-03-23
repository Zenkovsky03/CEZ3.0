namespace CEZ3._0.Application.Contracts.Responses.CourseSection;

public class CourseSectionResponse
{
    public string Id { get; set; } = string.Empty;
    public string CourseId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsFinalized { get; set; }
}