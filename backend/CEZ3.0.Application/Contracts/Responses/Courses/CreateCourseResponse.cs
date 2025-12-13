using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Contracts.Responses.Courses
{
    public class CreateCourseResponse
    {
        public string Message { get; set; } = "Course created successfully.";
        public string CourseId { get; set; } = default!;
    }
}
