using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.DTO
{
    public class ChatMessageDto
    {
        public string Id { get; set; } = default!;
        public string ConversationId { get; set; } = default!;
        public string Body { get; set; } = default!;
        public DateTime SentAt { get; set; }
        public string SenderId { get; set; } = default!;
        public bool IsRead { get; set; }
    }
}
