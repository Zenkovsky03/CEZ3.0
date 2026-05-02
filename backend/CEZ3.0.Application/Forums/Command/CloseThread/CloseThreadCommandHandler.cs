using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Command.CloseThread;

public class CloseThreadCommandHandler(ILogger<CloseThreadCommandHandler> logger,
    IUserContext userContext,
    IThreadRepository threadRepository) : IRequestHandler<CloseThreadCommand>
{
    private readonly ILogger<CloseThreadCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IThreadRepository _threadRepository = threadRepository;

    public async Task Handle(CloseThreadCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CloseThreadCommand for ThreadId: ");

        var currentUser = _userContext.GetCurrentUser();
        if (currentUser == null)
        {
            _logger.LogWarning("Unauthorized attempt to close thread with ThreadId: ");
            throw new UnauthorizedException("User must be authenticated to close a thread.");
        }

        var isId = ObjectId.TryParse(request.ThreadId, out var threadId);

        if (!isId)
        {
            _logger.LogWarning("Invalid ThreadId format: ");
            throw new BadRequestException("Invalid ThreadId format.");
        }

        var thread = await _threadRepository.GetActiveThreadByIdAsync(threadId);

        if (thread == null)
        {
            _logger.LogWarning("Thread not found with ThreadId: ");
            throw new BadRequestException("Thread not found.");
        }

        var isUId = ObjectId.TryParse(currentUser.id, out var authorId);
        if (!isUId)
        {
            _logger.LogWarning("Invalid UserId format: ");
            throw new BadRequestException("Invalid UserId format.");
        }

        if (!thread.AuthorId.Equals(authorId) || currentUser.role == UserRoles.Admin.ToString())
        {
            _logger.LogWarning("Unauthorized attempt to close thread with ThreadId: by UserId: ");
            throw new UnauthorizedException("Only the thread author can close the thread.");
        }

        thread.IsOpen = false;
        await _threadRepository.SaveChangesAsync();
    }
}
