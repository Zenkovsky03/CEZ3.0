using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.Announcements.Command.CreateAnnouncement;

public class CreateAnnouncementCommand : IRequest<string>
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    // Dodajemy cały kurs enrollment jako odbiorce
    public List<string> Recivers { get; set; } = new List<string>();
}
