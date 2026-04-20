using MediatR;

namespace CEZ3._0.Application.Forums.Command.CreateThread;

public class CreateThreadCommand : IRequest<string>
{
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string AuthorId { get; set; } = default!;
}
