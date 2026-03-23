using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.Command.AddMessage
{
    public class AddMessageCommand : IRequest
    {
        [JsonIgnore]
        public string? ConversationId { get; set; }
        public string Body { get; set; } = default!;
    }
}
