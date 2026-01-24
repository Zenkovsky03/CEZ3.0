using CEZ3._0.Domain.Constants.FileTypes;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CEZ3._0.Application.LessonAttachments.Command.AddLessonAttachment
{
    public class AddLessonAttachmentCommand : IRequest<string>
    {
        [JsonIgnore]
        [ValidateNever]
        public string LessonId { get; set; } = default!;

        [Required]
        public string FileName { get; set; } = default!;

        [Required]
        public string FileUrl { get; set; } = default!;

        [Required]
        [EnumDataType(typeof(AttachmentType))]
        public AttachmentType Type { get; set; }
    }
}
