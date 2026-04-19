using CEZ3._0.Application.Assignments.Dtos;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Assignments.Query.GetNearestAssignments;

public class GetNearestAssignmentsQueryHandler(ILogger<GetNearestAssignmentsQueryHandler> logger,
    IUserContext userContext,
    IAssignmentRepository assignmentRepository,
    ICourseEnrollmentRepository courseEnrollmentRepository,
    ICourseSectionRepository courseSectionRepository) : IRequestHandler<GetNearestAssignmentsQuery, List<AssignmentEventDto>>
{
    private readonly ILogger<GetNearestAssignmentsQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IAssignmentRepository _assignmentRepository = assignmentRepository;
    private readonly ICourseEnrollmentRepository _courseEnrollmentRepository = courseEnrollmentRepository;
    private readonly ICourseSectionRepository _courseSectionRepository = courseSectionRepository;

    public async Task<List<AssignmentEventDto>> Handle(GetNearestAssignmentsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetNearestAssignmentsQuery for user");

        var currentUser = _userContext.GetCurrentUser()
            ?? throw new UnauthorizedException("User must be logged in to enrol in a course.");

        var userId = ObjectId.Parse(currentUser.id);
        if (userId == null || userId == ObjectId.Empty)
        {
            _logger.LogWarning("Invalid user ID format for user: {UserId}", currentUser.id);
            throw new BadRequestException("Invalid user ID format.");
        }

        var courseEnrollments = await _courseEnrollmentRepository.GetEnrolledCoursesAsync(userId);

        if (courseEnrollments == null)
            throw new BadRequestException("No course enrollments found for the user.");

        var courseIds = courseEnrollments.Select(e => e.CourseId).Take(15).ToList();

        var nearestAssignments = await _assignmentRepository.GetNearestAssignmentsForUserAsync(userId, courseIds);

        if (nearestAssignments == null)
            throw new BadRequestException("No nearest assignments found for the user.");

        var sectionIds = nearestAssignments.Select(a => a.SectionId).Distinct().ToList();

        var section = await _courseSectionRepository.GetCourseSectionsByIdsAsync(sectionIds);

        var sectionDict = section
            .ToDictionary(s => s.Id, s => s.Title);

        var dto = nearestAssignments.Select(a => new AssignmentEventDto
        {
            CourseSectionTitle = sectionDict.TryGetValue(a.SectionId, out var title)
                ? title
                : "Unknown Section",
            Title = a.Title,
            Description = a.Description,
            DueDate = a.DueDate,
            TaskType = a.TaskType
        }).ToList();

        return dto;
    }
}
