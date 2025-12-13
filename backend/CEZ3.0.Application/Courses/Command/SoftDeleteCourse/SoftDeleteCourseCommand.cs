using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Courses.Command.SoftDeleteCourse
{
    public class SoftDeleteCourseCommand(string courseId) : IRequest
    {
        [Required]
        public string CourseId { get; set; } = courseId;
    }
}
