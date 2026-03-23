using CEZ3._0.Domain.Entities;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Repositories
{
    public interface IConversationRepository
    {
        Task<Conversation?> GetByIdAsync(ObjectId id);
        Task<List<Conversation>> GetUserConversationAsync(ObjectId userId);
        Task CreateAsync(Conversation conversation);
        Task AddMessageAsync(ObjectId conversationId, ChatMessage message);
        Task MarkAsReadAsync(ObjectId conversationId, ObjectId userId);
        Task<List<ChatMessage>> GetMessagesByConversationIdAsync(ObjectId conversationId);
        Task UpdateAsync(Conversation conversation);
    }
}
