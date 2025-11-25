using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Users.Command.BlockUser;

public class BlockUserCommandHandler(ILogger<BlockUserCommandHandler> logger) : IRequestHandler<BlockUserCommand>
{
    public Task Handle(BlockUserCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
