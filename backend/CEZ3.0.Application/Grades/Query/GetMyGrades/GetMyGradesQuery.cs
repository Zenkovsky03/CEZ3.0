using CEZ3._0.Application.Grades.Dtos;
using MediatR;

namespace CEZ3._0.Application.Grades.Query.GetMyGrades;

public class GetMyGradesQuery : IRequest<List<GradeDto>>
{
    public string? CourseId { get; set; }
}
