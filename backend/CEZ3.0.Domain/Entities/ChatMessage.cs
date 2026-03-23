using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Entities
{
    public class ChatMessage
    {
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
        public ObjectId ConversationId { get; set; }
        public string Body { get; set; } = default!;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public ObjectId SenderId { get; set; }
        public bool IsRead { get; set; } = false;
    }
}
