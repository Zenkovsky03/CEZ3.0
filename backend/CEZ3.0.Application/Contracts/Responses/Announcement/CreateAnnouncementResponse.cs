namespace CEZ3._0.Application.Contracts.Responses.Announcement;

public class CreateAnnouncementResponse
{
    public string Message { get; set; } = "Announcement created successfully.";
    public string AnnouncementId { get; set; } = string.Empty;
}
