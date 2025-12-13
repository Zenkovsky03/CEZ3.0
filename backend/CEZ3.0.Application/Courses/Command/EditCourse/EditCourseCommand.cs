using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Courses.Command.EditCourse
{
    public class EditCourseCommand : IRequest
    {
        public string CourseId { get; set; } = default!;
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = default!;
        [MaxLength(2000)]
        public string Description { get; set; } = default!;
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
    }
}
