using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.LessonAttachments.DTO
{
    public class LessonAttachmentDto
    {
        public string Id { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
