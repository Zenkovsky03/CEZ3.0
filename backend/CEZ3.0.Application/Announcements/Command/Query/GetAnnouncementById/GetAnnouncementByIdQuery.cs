using CEZ3._0.Application.Announcements.Command.Dtos;
using MediatR;

namespace CEZ3._0.Application.Announcements.Command.Query.GetAnnouncementById;

public class GetAnnouncementByIdQuery : IRequest<AnnouncementDto>
{
    public string AnnouncementId { get; set; } = string.Empty;

    public GetAnnouncementByIdQuery(string announcementId)
    {
        AnnouncementId = announcementId;
    }
}
