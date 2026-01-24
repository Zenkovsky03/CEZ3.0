using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.LessonAttachments.Command.DeleteLessonAttachment
{
    public class DeleteLessonAttachmentCommand(string AttachmentId) : IRequest
    {
        public string AttachmentId { get; } = AttachmentId;
    }
}
