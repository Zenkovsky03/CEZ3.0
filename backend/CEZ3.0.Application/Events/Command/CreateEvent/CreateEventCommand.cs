using MediatR;

namespace CEZ3._0.Application.Events.Command.CreateEvent;

public class CreateEventCommand : IRequest<string>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    // Dodajemy cały kurs enrollment jako odbiorce
    public List<string> Recivers { get; set; } = new List<string>();
}
