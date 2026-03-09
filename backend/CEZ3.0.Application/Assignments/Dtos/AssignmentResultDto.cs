using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Dtos
{
    public record AssignmentResultDto(
        string AttemptId,
        string StudentId,
        int Score,
        int MaxPoints,
        bool IsCompleted,
        DateTime StartedAt,
        DateTime? FinishedAt);
}
