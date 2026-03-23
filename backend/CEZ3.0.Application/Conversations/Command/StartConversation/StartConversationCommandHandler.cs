using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Communication;
using CEZ3._0.Domain.Constants.Roles;
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

namespace CEZ3._0.Application.Conversations.Command.StartConversation
{
    public class StartConversationCommandHandler(
        IConversationRepository conversationRepository,
        IUserContext userContext,
        ILogger<StartConversationCommandHandler> logger) : IRequestHandler<StartConversationCommand, ObjectId>
    {
        private readonly IConversationRepository _conversationRepository = conversationRepository;
        private readonly IUserContext _userContext = userContext;
        private readonly ILogger<StartConversationCommandHandler> _logger = logger;

        public async Task<ObjectId> Handle(StartConversationCommand request, CancellationToken cancellationToken)
        {
            var currentUser = _userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be authenticated.");

            var currentUserId = ObjectId.Parse(currentUser.id);
            var recipientId = ObjectId.Parse(request.RecepientId);

            if (request.Type == ConversationType.Direct)
            {
                var existing = (await _conversationRepository.GetUserConversationAsync(currentUserId))
                    .FirstOrDefault(c => c.Type == ConversationType.Direct
                    && (c.CreatorId == recipientId || c.RecipientId == recipientId));

                if (existing != null) return existing.Id;
            }

            var conversation = new Conversation
            {
                Id = ObjectId.GenerateNewId(),
                Title = request.Title,
                Type = request.Type,
                CreatorId = currentUserId,
                RecipientId = recipientId,
                Status = request.Type == ConversationType.Inquiry ? InquirySatus.AwaitingTeacherResponse : InquirySatus.Open,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _conversationRepository.CreateAsync(conversation);

            var firstMessage = new ChatMessage
            {
                Id = ObjectId.GenerateNewId(),
                ConversationId = conversation.Id,
                SenderId = currentUserId,
                Body = request.FistMessageBody,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            await _conversationRepository.AddMessageAsync(conversation.Id, firstMessage);

            return conversation.Id;
        }
    }
}
