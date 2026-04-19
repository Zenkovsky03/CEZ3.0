using CEZ3._0.Application.Assignments.Dtos;
using MediatR;

namespace CEZ3._0.Application.Assignments.Query.GetNearestAssignments;

public class GetNearestAssignmentsQuery : IRequest<List<AssignmentEventDto>>
{
}
