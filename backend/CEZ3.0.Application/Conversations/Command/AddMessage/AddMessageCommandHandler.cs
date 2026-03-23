using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.Command.AddMessage
{
    public class AddMessageCommandHandler(
    IConversationRepository repository,
    IUserContext userContext) : IRequestHandler<AddMessageCommand>
    {
        public async Task Handle(AddMessageCommand request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired.");
            var convId = ObjectId.Parse(request.ConversationId);
            var currentUserId = ObjectId.Parse(user.id);

            var conversation = await repository.GetByIdAsync(convId)
                ?? throw new BadRequestException("Conversation not found.");

            if (conversation.CreatorId != currentUserId && conversation.RecipientId != currentUserId)
                throw new ForbiddenException("Access denied.");

            var newMessage = new ChatMessage
            {
                Id = ObjectId.GenerateNewId(),
                ConversationId = convId,
                SenderId = currentUserId,
                Body = request.Body,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            await repository.AddMessageAsync(convId, newMessage);
        }
    }
}
