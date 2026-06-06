using CEZ3._0.Application.Forums.Dtos;
using CEZ3._0.Application.Helpers;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Query.GetFullThead;

public class GetFullTheadQueryHandler(ILogger<GetFullTheadQueryHandler> logger,
    IUserRepository userRepository,
    IThreadRepository threadRepository,
    IThreadReplayRepository threadReplayRepository) : IRequestHandler<GetFullTheadQuery, ThreadDto>
{
    private readonly ILogger<GetFullTheadQueryHandler> _logger = logger;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IThreadRepository _threadRepository = threadRepository;
    private readonly IThreadReplayRepository _threadReplayRepository = threadReplayRepository;

    public async Task<ThreadDto> Handle(GetFullTheadQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetFullTheadQuery for ThreadId: , PageNumber: , PageSize: ");

        var isId = ObjectId.TryParse(request.ThreadId, out var threadId);

        if (!isId)
            throw new BadRequestException("Invalid ThreadId format.");

        var thread = await _threadRepository.GetActiveThreadByIdAsync(threadId);
        if (thread == null)
            throw new BadRequestException("Thread not found or is inactive.");

        var author = await _userRepository.GetByIdAsync(thread.AuthorId);
        if (author == null)
            throw new BadRequestException("Author of the thread not found.");

        var replays = await _threadReplayRepository.GetReplaysByThreadIdAsync(threadId, request.PageNumber, request.PageSize);

        var totalReplays = await _threadReplayRepository.GetTotalReplaysByThreadIdAsync(threadId);

        var replyAuthorIds = replays.Select(r => r.AuthorId).Distinct().ToList();
        var replyAuthors = await _userRepository.GetUsersByIdsAsync(replyAuthorIds);
        var replyAuthorDict = replyAuthors.ToDictionary(u => u.Id, u => u);

        var dto = new ThreadDto
        {
            Id = thread.Id,
            Title = thread.Title,
            Content = thread.Content,
            AuthorId = thread.AuthorId,
            Author = new Users.Dtos.UserDto
            {
                Id = author.Id.ToString(),
                FirstName = author.FirstName,
                LastName = author.LastName,
                Email = author.Email
            },
            CreatedAt = thread.CreatedAt,
            IsOpen = thread.IsOpen,
            TotalReplies = thread.TotalReplies,
            Replies = new PagedResult<ThreadReplayDto>(replays.Select(r =>
            {
                var replyAuthor = replyAuthorDict.GetValueOrDefault(r.AuthorId);
                return new ThreadReplayDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    AuthorId = r.AuthorId,
                    AuthorName = replyAuthor == null
                        ? "Nieznany"
                        : $"{replyAuthor.FirstName} {replyAuthor.LastName}",
                    CreatedAt = r.CreatedAt
                };
            }).ToList(), request.PageNumber, request.PageSize, totalReplays)
        };

        return dto;
    }
}
