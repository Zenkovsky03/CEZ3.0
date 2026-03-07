namespace CEZ3._0.Application.Announcements.Command.Dtos;

public class AnnouncementDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string CreatorEmail { get; set; } = string.Empty;
    public string CreatorFirstName { get; set; } = string.Empty;
    public string CreatorLastName { get; set; } = string.Empty;
    public string CreatorRole { get; set; } = string.Empty;
    public string CreatorId { get; set; } = string.Empty;
}

