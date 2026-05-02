using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities.Forum;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Command.CreateThreadReplay;

public class CreateThreadReplayCommandHandler(ILogger<CreateThreadReplayCommandHandler> logger,
    IUserContext userContext,
    IUserRepository userRepository,
    IThreadRepository threadRepository,
    IThreadReplayRepository threadReplayRepository) : IRequestHandler<CreateThreadReplayCommand, string>
{
    private readonly ILogger<CreateThreadReplayCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IThreadRepository _threadRepository = threadRepository;
    private readonly IThreadReplayRepository _threadReplayRepository = threadReplayRepository;

    public async Task<string> Handle(CreateThreadReplayCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CreateThreadReplayCommand for ThreadId, by User");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        var currentUserId = ObjectId.Parse(currentUser.id);

        var user = await _userRepository.GetByIdAsync(currentUserId);
        if (user == null)
        {
            throw new UnauthorizedException("User not found.");
        }

        var threadId = ObjectId.TryParse(request.ThreadId, out var parsedThreadId);
        if (!threadId)
        {
            throw new BadRequestException("Thread not found.");
        }

        var thread = await _threadRepository.GetActiveThreadByIdAsync(parsedThreadId);

        if (thread == null)
            throw new BadRequestException("Thread not found.");

        if (!thread.IsOpen)
            throw new ForbiddenException("Thread is closed for new replies.");

        if (request.Content.Length > 500)
        {
            _logger.LogWarning("Thread replay content exceeds maximum length. User: {UserId}, Content Length: {ContentLength}",
                currentUser.id, request.Content.Length);

            throw new BadRequestException("Thread replay content cannot exceed 500 characters.");
        }

        thread.TotalReplies += 1;

        await _threadRepository.SaveChangesAsync();

        var threadReplay = new ThreadReplay
        {
            ThreadId = parsedThreadId,
            AuthorId = currentUserId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
            AuthorName = user.Username
        };

        var replayId = await _threadReplayRepository.CreateThreadReplayAsync(threadReplay);

        return replayId;
    }
}
