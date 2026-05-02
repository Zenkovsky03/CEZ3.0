using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Command.CreateThread;

public class CreateThreadCommandHandler(ILogger<CreateThreadCommandHandler> logger,
    IUserContext userContext,
    IThreadRepository threadRepository) : IRequestHandler<CreateThreadCommand, string>
{
    private readonly ILogger<CreateThreadCommandHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IThreadRepository _threadRepository = threadRepository;


    public async Task<string> Handle(CreateThreadCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling CreateThreadCommand for user");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        var currentUserId = ObjectId.Parse(currentUser.id);

        if (request.Title.Length > 100)
        {
            _logger.LogWarning("Thread title exceeds maximum length. User: {UserId}, Title Length: {TitleLength}",
                currentUser.id, request.Title.Length);

            throw new BadRequestException("Thread title cannot exceed 100 characters.");
        }

        if (request.Content.Length > 1000)
        {
            _logger.LogWarning("Thread content exceeds maximum length. User: {UserId}, Content Length: {ContentLength}",
                currentUser.id, request.Content.Length);

            throw new BadRequestException("Thread content cannot exceed 1000 characters.");
        }

        var thread = new Domain.Entities.Forum.Thread
        {
            Title = request.Title,
            Content = request.Content,
            AuthorId = currentUserId,
            CreatedAt = DateTime.UtcNow,
            IsOpen = true,
            IsActive = true,
            TotalReplies = 0
        };

        var id = await _threadRepository.AddThreadAsync(thread);

        return id;
    }
}
