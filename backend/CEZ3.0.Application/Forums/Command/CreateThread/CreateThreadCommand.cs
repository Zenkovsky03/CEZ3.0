using MediatR;

namespace CEZ3._0.Application.Forums.Command.CreateThread;

public class CreateThreadCommand : IRequest<string>
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
