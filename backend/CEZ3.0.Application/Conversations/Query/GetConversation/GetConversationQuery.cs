using CEZ3._0.Application.Conversations.DTO;
using CEZ3._0.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.Query.GetConversation
{
    public record GetConversationQuery(string ConversationId) : IRequest<ConversationChatResponse>;
}
