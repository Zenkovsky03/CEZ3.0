using CEZ3._0.Application.CourseSections.Dtos;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.CourseSections.Query.GetCourseSectionById;

public class GetCourseSectionByIdQueryHandler(ILogger<GetCourseSectionByIdQueryHandler> logger,
    IUserContext userContext,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<GetCourseSectionByIdQuery, CourseSectionDto>
{
    private readonly ILogger<GetCourseSectionByIdQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<CourseSectionDto> Handle(GetCourseSectionByIdQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetCourseSectionByIdQuery for CourseSectionId: {CourseSectionId}", request.CourseSectionId);

        var user = _userContext.GetCurrentUser();

        if (user == null)
        {
            _logger.LogWarning("Unauthorized access attempt to GetCourseSectionByIdQuery");
            throw new UnauthorizedAccessException("User must be authenticated to access course section details.");
        }

        var id = ObjectId.TryParse(request.CourseSectionId, out var objectId) ? objectId : throw new BadRequestException("Invalid CourseSectionId format.");

        var courseSection = await _courseSectionRepository.GetByIdAsync(id);

        if (courseSection == null)
        {
            _logger.LogWarning("CourseSection with id {CourseSectionId} not found", request.CourseSectionId);
            throw new NotFoundException($"CourseSection with id {request.CourseSectionId} not found.");
        }

        var dto = new CourseSectionDto
        {
            Id = courseSection.Id,
            CourseId = courseSection.CourseId,
            Title = courseSection.Title,
            OrderIndex = courseSection.OrderIndex,
            CreatedAt = courseSection.CreatedAt,
            IsActive = courseSection.IsActive,
            IsFinalized = courseSection.IsFinalized
        };

        return dto;
    }
}
