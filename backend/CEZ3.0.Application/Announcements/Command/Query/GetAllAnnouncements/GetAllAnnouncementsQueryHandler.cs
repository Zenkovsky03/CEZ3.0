using CEZ3._0.Application.Announcements.Command.Dtos;
using CEZ3._0.Application.Helpers;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Announcements.Command.Query.GetAllAnnouncements;

public class GetAllAnnouncementsQueryHandler(ILogger<GetAllAnnouncementsQueryHandler> logger,
    IUserContext userContext,
    IAnnouncementRepository announcementRepository,
    IUserRepository userRepository) : IRequestHandler<GetAllAnnouncementsQuery, PagedResult<AnnouncementDto>>
{
    private readonly ILogger<GetAllAnnouncementsQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IAnnouncementRepository _announcementRepository = announcementRepository;
    private readonly IUserRepository _userRepository = userRepository;


    public async Task<PagedResult<AnnouncementDto>> Handle(GetAllAnnouncementsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetAllAnnouncementsQuery with PageNumber: {PageNumber} and PageSize: {PageSize}", request.PageNumber, request.PageSize);

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

        var announcements = await _announcementRepository.GetAnnouncementsAsync(request.PageNumber, request.PageSize, userId);
        var totalCount = await _announcementRepository.GetTotalAnnouncementsCountAsync(userId);

        var announcementDtos = await Task.WhenAll(
            announcements.Select(async a =>
            {
                var user = await _userRepository.GetByIdAsync(a.CreatedById);

                return new AnnouncementDto
                {
                    Id = a.Id.ToString(),
                    Title = a.Title,
                    Content = a.Content,
                    CreatedAt = a.CreatedAt,
                    CreatorRole = user?.Role ?? "Unknown",
                    CreatorEmail = user?.Email ?? "Unknown",
                    CreatorFirstName = user?.FirstName ?? "Unknown",
                    CreatorLastName = user?.LastName ?? "Unknown",
                    CreatorId = user?.Id.ToString() ?? "Unknown"
                };
            })
        );

        var pagedResult = new PagedResult<AnnouncementDto>(announcementDtos.ToList(), totalCount, request.PageNumber, request.PageSize);
        return pagedResult;
    }
}
