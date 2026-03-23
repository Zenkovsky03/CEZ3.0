using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Infrastructure.Repositories
{
    public class ConversationRepository(CezDbContext dbContext) : IConversationRepository
    {
        private readonly CezDbContext _dbContext = dbContext;

        public async Task<Conversation?> GetByIdAsync(ObjectId id)
        {
            return await _dbContext.Conversations.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<ChatMessage>> GetMessagesByConversationIdAsync(ObjectId conversationId)
        {
            return await _dbContext.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<List<Conversation>> GetUserConversationAsync(ObjectId userId)
        {
            return await _dbContext.Conversations
                .Where(c => c.CreatorId == userId || c.RecipientId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        public async Task CreateAsync(Conversation conversation)
        {
            await _dbContext.Conversations.AddAsync(conversation);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddMessageAsync(ObjectId conversationId, ChatMessage message)
        {
            message.ConversationId = conversationId;
            await _dbContext.Messages.AddAsync(message);

            var conversation = await _dbContext.Conversations
                .FirstOrDefaultAsync(c => c.Id == conversationId)
                ?? throw new Exception("Conversation not found");

            conversation.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        public async Task MarkAsReadAsync(ObjectId conversationId, ObjectId userId)
        {
            var messages = await _dbContext.Messages
                .Where(m => m.ConversationId == conversationId && m.SenderId != userId && !m.IsRead)
                .ToListAsync();

            foreach (var message in messages)
            {
                message.IsRead = true;
            }
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Conversation conversation)
        {
            _dbContext.Conversations.Update(conversation);
            await _dbContext.SaveChangesAsync();
        }
    }
}
