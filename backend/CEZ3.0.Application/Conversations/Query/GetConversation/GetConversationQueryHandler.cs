using CEZ3._0.Application.Conversations.DTO;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.Query.GetConversation
{
    public class GetConversationQueryHandler(
    IConversationRepository repository,
    IUserContext userContext) : IRequestHandler<GetConversationQuery, ConversationChatResponse>
    {
        public async Task<ConversationChatResponse> Handle(GetConversationQuery request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired.");
            var convId = ObjectId.Parse(request.ConversationId);
            var currentUserId = ObjectId.Parse(user.id);

            var conversation = await repository.GetByIdAsync(convId)
                ?? throw new BadRequestException("Conversation not found.");

            if (conversation.CreatorId != currentUserId && conversation.RecipientId != currentUserId)
                throw new ForbiddenException("Access denied.");

            var messages = await repository.GetMessagesByConversationIdAsync(convId);

            await repository.MarkAsReadAsync(convId, currentUserId);

            return new ConversationChatResponse
            {
                Conversation = new ConversationDto
                {
                    Id = conversation.Id.ToString(),
                    Title = conversation.Title,
                    Type = (int)conversation.Type,
                    Status = (int)conversation.Status,
                    CreatorId = conversation.CreatorId.ToString(),
                    RecipientId = conversation.RecipientId.ToString(),
                    CreatedAt = conversation.CreatedAt,
                    UpdatedAt = conversation.UpdatedAt,
                    ClosedAt = conversation.ClosedAt
                },
                Messages = messages.Select(m => new ChatMessageDto
                {
                    Id = m.Id.ToString(),
                    ConversationId = m.ConversationId.ToString(),
                    Body = m.Body,
                    SentAt = m.SentAt,
                    SenderId = m.SenderId.ToString(),
                    IsRead = m.IsRead
                }).ToList()
            };
        }
    }
}
