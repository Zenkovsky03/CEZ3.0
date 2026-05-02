using CEZ3._0.Application.Forums.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Forums.Query.GetThreadReplay;

public class GetThreadReplayQueryHandler(ILogger<GetThreadReplayQueryHandler> logger,
    IThreadReplayRepository threadReplayRepository,
    IUserRepository userRepository) : IRequestHandler<GetThreadReplayQuery, ThreadReplayDto>
{
    private readonly ILogger<GetThreadReplayQueryHandler> _logger = logger;
    private readonly IThreadReplayRepository _threadReplayRepository = threadReplayRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<ThreadReplayDto> Handle(GetThreadReplayQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetThreadReplayQuery for ThreadId: ");

        var isId = ObjectId.TryParse(request.ThreadId, out var trId);
        if (!isId)
        {
            _logger.LogWarning("Invalid ThreadId format:");
            throw new BadRequestException("Invalid ThreadId format.");
        }

        var threadReplay = await _threadReplayRepository.GetThreadReplayByIdAsync(trId);
        if (threadReplay == null)
        {
            _logger.LogWarning("ThreadReplay not found for ThreadId: {ThreadId}", request.ThreadId);
            throw new BadRequestException("ThreadReplay not found.");
        }

        var author = await _userRepository.GetByIdAsync(threadReplay.AuthorId);

        var dto = new ThreadReplayDto
        {
            Id = threadReplay.Id,
            Content = threadReplay.Content,
            AuthorId = threadReplay.AuthorId,
            AuthorName = author?.Username ?? "Unknown",
            CreatedAt = threadReplay.CreatedAt
        };

        return dto;
    }
}
