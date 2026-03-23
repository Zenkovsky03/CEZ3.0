using CEZ3._0.Application.Users.Dtos;

namespace CEZ3._0.Application.Courses.Dtos;

public class CourseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool Archived { get; set; }
    public string OwnerId { get; set; } = string.Empty;
    public UserDto Owner { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool IsPasswordProtected { get; set; }
    public int ParticipantsCount { get; set; }
}
