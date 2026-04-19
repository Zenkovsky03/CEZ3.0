using CEZ3._0.Application.Assignments.Dtos;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Assignments.Query.GetUngradedHomework
{
    public class GetUngradedHomeworkQueryHandler(
        IAttemptRepository attemptRepository,
        IAssignmentRepository assignmentRepository,
        ICourseRepository courseRepository,
        IGradeRepository gradeRepository,
        IUserContext userContext) : IRequestHandler<GetUngradedHomeworkQuery, List<UngradedHomeworkDto>>
    {
        public async Task<List<UngradedHomeworkDto>> Handle(GetUngradedHomeworkQuery request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired");
            if (user.role != UserRoles.Teacher.ToString() && user.role != UserRoles.Admin.ToString())
                throw new ForbiddenException("Only teachers can access this list.");

            var teacherId = ObjectId.Parse(user.id);

            var teacherCourses = await courseRepository.GetByOwnerIdAsync(teacherId);
            var courseIds = teacherCourses.Select(c => c.Id).ToList();

            var result = new List<UngradedHomeworkDto>();

            foreach (var course in teacherCourses)
            {
                var assignments = await assignmentRepository.GetByCourseIdAsync(course.Id);
                var homeworks = assignments.Where(a => a.TaskType == "Homework");

                foreach (var hw in homeworks)
                {
                    var attempts = await attemptRepository.GetResultsByAssignmentIdAsync(hw.Id);
                    var completedAttempts = attempts.Where(a => a.IsCompleted);

                    foreach (var attempt in completedAttempts)
                    {
                        var gradeExists = await gradeRepository.ExistsAsync(hw.Id, attempt.StudentId);

                        if (!gradeExists)
                        {
                            result.Add(new UngradedHomeworkDto(
                                attempt.Id.ToString(),
                                hw.Id.ToString(),
                                hw.Title,
                                course.Name,
                                attempt.StudentId.ToString(),
                                attempt.SubmissionText,
                                attempt.FinishedAt ?? attempt.StartedAt
                            ));
                        }
                    }
                }
            }

            return result.OrderByDescending(r => r.SubmittedAt).ToList();
        }
    }
}
