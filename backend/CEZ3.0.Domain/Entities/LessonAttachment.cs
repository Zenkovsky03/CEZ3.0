using CEZ3._0.Domain.Constants.FileTypes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Entities
{
    public class LessonAttachment
    {
        public ObjectId Id { get; set; }
        public ObjectId SectionMaterialId { get; set; }
        public SectionMaterial SectionMaterial { get; set; } = default!;
        public string FileName { get; set; } = default!; 
        public string FileUrl { get; set; } = default!;  

        [BsonRepresentation(BsonType.String)]
        public AttachmentType Type { get; set; }  

        public DateTime CreatedAt { get; set; }
    }
}
