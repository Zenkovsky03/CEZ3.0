using MediatR;

namespace CEZ3._0.Application.Announcements.Command.DeleteAnnouncement;

public class DeleteAnnouncementCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}
