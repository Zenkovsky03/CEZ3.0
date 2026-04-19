using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Dtos
{
    public record UngradedHomeworkDto(
        string AttemptId,
        string AssignmentId,
        string AssignmentTitle,
        string CourseTitle,
        string StudentId,
        string? SubmissionText,
        DateTime SubmittedAt
    );
}
