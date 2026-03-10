namespace CEZ3._0.Application.Contracts.Responses.Events;

public class CreateEventResponse
{
    public string Message { get; set; } = "Event created successfully.";
    public string EventId { get; set; } = string.Empty;
}
