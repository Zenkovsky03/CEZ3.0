using MediatR;

namespace CEZ3._0.Application.CourseSections.Command.RollbackFinalizedCourseSection;

public class RollbackFinalizedCourseSectionCommand : IRequest<string>
{
    public string CourseSectionId { get; set; } = string.Empty;

    public RollbackFinalizedCourseSectionCommand(string courseSectionId)
    {
        CourseSectionId = courseSectionId;
    }
}
