using CEZ3._0.Application.Assignments.Dtos;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace CEZ3._0.Application.Assignments.Query.GetAssignmentsByCourse;

public class GetAssignmentsByCourseQueryHandler(
    ILogger<GetAssignmentsByCourseQueryHandler> logger,
    IAssignmentRepository assignmentRepository)
    : IRequestHandler<GetAssignmentsByCourseQuery, List<AssignmentDto>>
{
    private readonly ILogger<GetAssignmentsByCourseQueryHandler> _logger = logger;
    private readonly IAssignmentRepository _assignmentRepository = assignmentRepository;

    public async Task<List<AssignmentDto>> Handle(GetAssignmentsByCourseQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetAssignmentsByCourseQuery for CourseId: {CourseId}", request.CourseId);

        var courseId = ObjectId.TryParse(request.CourseId, out var objectId)
            ? objectId
            : throw new BadRequestException("Invalid CourseId format.");

        var assignments = await _assignmentRepository.GetByCourseIdAsync(courseId);

        return assignments.Select(a => new AssignmentDto
        {
            Id = a.Id,
            SectionId = a.SectionId,
            CourseId = a.CourseId,
            Title = a.Title,
            Description = a.Description,
            MaxPoint = a.MaxPoint,
            DueDate = a.DueDate,
            TaskType = a.TaskType,
            CreatedAt = a.CreatedAt
        }).ToList();
    }
}
