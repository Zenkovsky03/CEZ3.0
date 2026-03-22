using MediatR;

namespace CEZ3._0.Application.CourseSections.Command.FinalizedCourse;

public class FinalizedCourseSectionCommand : IRequest<string>
{
    public string CourseSectionId { get; set; } = string.Empty;

    public FinalizedCourseSectionCommand(string courseSectionId)
    {
        CourseSectionId = courseSectionId;
    }
}
