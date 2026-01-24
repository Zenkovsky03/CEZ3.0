using CEZ3._0.Application.LessonAttachments.DTO;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.LessonAttachments.Query.GetLessonAttachments
{
    public class GetLessonAttachmentsQueryHandler(ILessonAttachmentRepository attachmentRepository) : IRequestHandler<GetLessonAttachmentsQuery, IEnumerable<LessonAttachmentDto>>
    {
        public async Task<IEnumerable<LessonAttachmentDto>> Handle(GetLessonAttachmentsQuery request, CancellationToken cancellationToken)
        {
            if (!ObjectId.TryParse(request.LessonId, out var lessonId))
                return [];

            var attachments = await attachmentRepository.GetAllByLessonIdAsync(lessonId);

            return attachments.Select(a => new LessonAttachmentDto
            {
                Id = a.Id.ToString(),
                FileName = a.FileName,
                FileUrl = a.FileUrl,
                Type = a.Type.ToString(),
                CreatedAt = a.CreatedAt
            });
        }
    }
}
