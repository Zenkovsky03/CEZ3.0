using CEZ3._0.Application.Announcements.Command.Dtos;
using CEZ3._0.Application.Helpers;
using MediatR;

namespace CEZ3._0.Application.Announcements.Command.Query.GetAllAnnouncements;

public class GetAllAnnouncementsQuery : IRequest<PagedResult<AnnouncementDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 5;

    public GetAllAnnouncementsQuery(int pageNumber, int pageSize)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}
