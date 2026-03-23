using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.DTO
{
    public class ConversationDto
    {
        public string Id { get; set; } = default!;
        public string? Title { get; set; }
        public int Type { get; set; }
        public int Status { get; set; }
        public string CreatorId { get; set; } = default!;
        public string RecipientId { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
    }
}
