using CEZ3._0.Application.Forums.Dtos;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Forums.Query.GetThreadsHeader;

public class GetThreadsHeaderQueryHandler(ILogger<GetThreadsHeaderQueryHandler> logger,
    IThreadRepository threadRepository,
    IUserRepository userRepository) : IRequestHandler<GetThreadsHeaderQuery, List<ThreadDto>>
{
    private readonly ILogger<GetThreadsHeaderQueryHandler> _logger = logger;
    private readonly IThreadRepository _threadRepository = threadRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<List<ThreadDto>> Handle(GetThreadsHeaderQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetThreadsHeaderQuery with PageNumber: and PageSize: ");

        var threads = await _threadRepository.GetThreadsHeaderAsync(request.PageNumber, request.PageSize);

        var userIds = threads.Select(t => t.AuthorId).Distinct().ToList();
        var users = await _userRepository.GetUsersByIdsAsync(userIds);
        var userDict = users.ToDictionary(u => u.Id, u => u);

        var threadDtos = threads.Select(thread =>
        {
            var author = userDict.GetValueOrDefault(thread.AuthorId);
            return new ThreadDto
            {
                Id = thread.Id,
                Title = thread.Title,
                AuthorId = thread.AuthorId,
                Author = author == null ? null! : new Users.Dtos.UserDto
                {
                    Id = author.Id.ToString(),
                    FirstName = author.FirstName,
                    LastName = author.LastName,
                    Email = author.Email
                },
                CreatedAt = thread.CreatedAt,
                IsOpen = thread.IsOpen,
                TotalReplies = thread.TotalReplies
            };
        }).ToList();

        return threadDtos;
    }
}
