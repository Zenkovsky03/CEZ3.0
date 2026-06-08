using MediatR;

namespace CEZ3._0.Application.Announcements.Command.UpdateAnnouncement;

public class UpdateAnnouncementCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
