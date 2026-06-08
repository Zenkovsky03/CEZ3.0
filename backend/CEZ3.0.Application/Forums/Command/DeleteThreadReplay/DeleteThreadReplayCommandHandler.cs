using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Command.DeleteThreadReplay;

public class DeleteThreadReplayCommandHandler(ILogger<DeleteThreadReplayCommandHandler> logger,
    IUserContext userContext,
    IThreadReplayRepository threadReplayRepository,
    IThreadRepository threadRepository) : IRequestHandler<DeleteThreadReplayCommand>
{
    private readonly ILogger<DeleteThreadReplayCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IThreadReplayRepository _threadReplayRepository = threadReplayRepository;
    private readonly IThreadRepository _threadRepository = threadRepository;

    public async Task Handle(DeleteThreadReplayCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("User is deleting thread replay ");

        var currentUser = _userContext.GetCurrentUser();
        if (currentUser == null)
        {
            _logger.LogWarning("Unauthorized attempt to close thread with ");
            throw new UnauthorizedException("User must be authenticated to delete a thread replay.");
        }

        var isId = ObjectId.TryParse(request.ThreadReplayId, out var threadId);

        if (!isId)
        {
            _logger.LogWarning("Invalid thread replay id format: ");
            throw new BadRequestException("Invalid thread replay id format.");
        }

        var threadReplay = await _threadReplayRepository.GetThreadReplayByIdAsync(threadId);

        if (threadReplay == null)
        {
            _logger.LogWarning("Thread replay not found with id: ");
            throw new BadRequestException("Thread replay not found.");
        }

        var isUId = ObjectId.TryParse(currentUser.id, out var authorId);
        if (!isUId)
        {
            _logger.LogWarning("Invalid UserId format: ");
            throw new BadRequestException("Invalid UserId format.");
        }

        if (!threadReplay.AuthorId.Equals(authorId) && currentUser.role != UserRoles.Admin.ToString())
        {
            throw new ForbiddenException("You do not have permission to delete this thread replay.");
        }

        threadReplay.IsActive = false;
        await _threadReplayRepository.SaveChangesAsync();

        var thread = await _threadRepository.GetThreadByIdAsync(threadReplay.ThreadId);
        if (thread != null)
        {
            thread.TotalReplies = await _threadReplayRepository.GetTotalReplaysByThreadIdAsync(thread.Id);
            await _threadRepository.SaveChangesAsync();
        }
    }
}
