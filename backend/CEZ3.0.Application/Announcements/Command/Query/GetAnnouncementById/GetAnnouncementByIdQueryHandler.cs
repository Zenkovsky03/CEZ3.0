using CEZ3._0.Application.Announcements.Command.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Announcements.Command.Query.GetAnnouncementById;

public class GetAnnouncementByIdQueryHandler(ILogger<GetAnnouncementByIdQueryHandler> logger,
    IAnnouncementRepository announcementRepository,
    IUserRepository userRepository) : IRequestHandler<GetAnnouncementByIdQuery, AnnouncementDto>
{
    private readonly ILogger<GetAnnouncementByIdQueryHandler> _logger = logger;
    private readonly IAnnouncementRepository _announcementRepository = announcementRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<AnnouncementDto> Handle(GetAnnouncementByIdQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetAnnouncementByIdQuery for AnnouncementId: {AnnouncementId}", request.AnnouncementId);

        var id = ObjectId.Parse(request.AnnouncementId);

        if (id == ObjectId.Empty)
        {
            _logger.LogWarning("Invalid AnnouncementId: {AnnouncementId}", request.AnnouncementId);
            throw new BadRequestException("Invalid AnnouncementId");
        }

        var announcement = await _announcementRepository.GetById(id);

        if (announcement == null)
        {
            _logger.LogWarning("Announcement not found for AnnouncementId: {AnnouncementId}", request.AnnouncementId);

            throw new BadRequestException("Announcement not found");
        }

        var creator = await _userRepository.GetByIdAsync(announcement.CreatedById);

        if (creator == null)
        {
            _logger.LogWarning("Creator not found for AnnouncementId: {AnnouncementId}, CreatedById: {CreatedById}", request.AnnouncementId, announcement.CreatedById);
            throw new BadRequestException("Creator not found");
        }

        var dto = new AnnouncementDto
        {
            Id = announcement.Id.ToString(),
            Title = announcement.Title,
            Content = announcement.Content,
            CreatedAt = announcement.CreatedAt,
            CreatorEmail = creator.Email,
            CreatorFirstName = creator.FirstName,
            CreatorLastName = creator.LastName,
            CreatorRole = creator.Role
        };


        return dto;
    }
}
