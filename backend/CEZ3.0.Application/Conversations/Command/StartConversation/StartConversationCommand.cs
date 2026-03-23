using CEZ3._0.Domain.Constants.Communication;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.Command.StartConversation
{
    public class StartConversationCommand : IRequest<ObjectId>
    {
        public string? Title { get; set; }
        public string FistMessageBody { get; set; } = default!;
        public string RecepientId { get; set; } = default!;
        public ConversationType Type { get; set; }
    }
}
