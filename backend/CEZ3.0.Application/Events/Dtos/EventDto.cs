namespace CEZ3._0.Application.Events.Dtos;

public class EventDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatorEmail { get; set; } = string.Empty;
    public string CreatorFirstName { get; set; } = string.Empty;
    public string CreatorLastName { get; set; } = string.Empty;
    public string CreatorRole { get; set; } = string.Empty;
    public string CreatorId { get; set; } = string.Empty;
}
