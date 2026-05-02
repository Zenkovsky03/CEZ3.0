using CEZ3._0.Application.Forums.Dtos;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Forums.Query.GetThreadsHeader;

public class GetThreadsHeaderQueryHandler(ILogger<GetThreadsHeaderQueryHandler> logger,
    IThreadRepository threadRepository) : IRequestHandler<GetThreadsHeaderQuery, List<ThreadDto>>
{
    private readonly ILogger<GetThreadsHeaderQueryHandler> _logger = logger;
    private readonly IThreadRepository _threadRepository = threadRepository;

    public async Task<List<ThreadDto>> Handle(GetThreadsHeaderQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetThreadsHeaderQuery with PageNumber: and PageSize: ");

        var threads = await _threadRepository.GetThreadsHeaderAsync(request.PageNumber, request.PageSize);

        var threadDtos = threads.Select(thread => new ThreadDto
        {
            Id = thread.Id,
            Title = thread.Title,
            AuthorId = thread.AuthorId,
            CreatedAt = thread.CreatedAt,
            IsOpen = thread.IsOpen,
            TotalReplies = thread.TotalReplies
        }).ToList();

        return threadDtos;
    }
}
