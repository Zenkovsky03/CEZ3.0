using CEZ3._0.Application.LessonAttachments.DTO;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.LessonAttachments.Query.GetLessonAttachments
{
    public class GetLessonAttachmentsQuery(string lessonId) : IRequest<IEnumerable<LessonAttachmentDto>>
    {
        public string LessonId { get; } = lessonId;
    }
}
