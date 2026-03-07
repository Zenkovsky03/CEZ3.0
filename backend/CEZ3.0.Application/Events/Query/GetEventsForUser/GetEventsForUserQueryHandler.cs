using CEZ3._0.Application.Events.Dtos;
using CEZ3._0.Application.Helpers;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Events.Query.GetEventsForUser;

public class GetEventsForUserQueryHandler(ILogger<GetEventsForUserQueryHandler> logger,
    IUserContext userContext,
    IEventRepository eventRepository,
    IUserRepository userRepository) : IRequestHandler<GetEventsForUserQuery, PagedResult<EventDto>>
{
    private readonly ILogger<GetEventsForUserQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IEventRepository _eventRepository = eventRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<PagedResult<EventDto>> Handle(GetEventsForUserQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetEventsForUserQuery");

        if (request.PageNumber <= 0 || request.PageSize <= 0)
        {
            request.PageNumber = 1;
            request.PageSize = 5;
        }

        if (request.PageSize > 30)
        {
            request.PageSize = 30;
        }

        var currentUser = _userContext.GetCurrentUser();
        if (currentUser == null)
        {
            _logger.LogWarning("Unauthorized access attempt to GetAllAnnouncementsQuery");
            throw new UnauthorizedException("User must be authenticated to access announcements.");
        }

        var userId = ObjectId.Parse(currentUser.id);
        if (userId == null || userId == ObjectId.Empty)
        {
            _logger.LogWarning("Invalid user ID format for user: {UserId}", currentUser.id);
            throw new BadRequestException("Invalid user ID format.");
        }

        var events = await _eventRepository.GetEventsForUserAsync(userId, request.PageNumber, request.PageSize);

        var totalCount = await _eventRepository.GetTotalEventCountForUserAsync(userId);

        var eventDtos = await Task.WhenAll(
            events.Select(async e =>
            {
                var creator = await _userRepository.GetByIdAsync(e.CreatedById);

                return new EventDto
                {
                    Id = e.Id.ToString(),
                    Title = e.Title,
                    Description = e.Description,
                    StartTime = e.StartTime,
                    EndTime = e.EndTime,
                    CreatedAt = e.CreatedAt,
                    CreatorEmail = creator?.Email ?? "Unknown",
                    CreatorFirstName = creator?.FirstName ?? "Unknown",
                    CreatorLastName = creator?.LastName ?? "Unknown",
                    CreatorRole = creator?.Role ?? "Unknown",
                    CreatorId = creator?.Id.ToString() ?? "Unknown"
                };
            })
            );

        var pagedResult = new PagedResult<EventDto>(eventDtos.ToList(), totalCount, request.PageNumber, request.PageSize);
        return pagedResult;
    }
}
