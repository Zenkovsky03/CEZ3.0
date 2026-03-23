using CEZ3._0.Domain.Constants.Communication;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Entities
{
    public class Conversation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string? Title { get; set; } = default!;
        public ConversationType Type { get; set; }
        public InquirySatus Status { get; set; }
        public ObjectId CreatorId { get; set; }
        public ObjectId RecipientId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
    }
}
