using CEZ3._0.Application.Conversations.DTO;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.Conversations.Query.GetConversation;

public class GetConversationQueryHandler(
    IConversationRepository repository,
    IUserContext userContext,
    IUserRepository userRepository) : IRequestHandler<GetConversationQuery, ConversationChatResponse>
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

        var otherId = conversation.CreatorId == currentUserId
            ? conversation.RecipientId
            : conversation.CreatorId;

        var otherUser = await userRepository.GetByIdAsync(otherId);

        var senderIds = messages.Select(m => m.SenderId).Distinct().ToList();
        var senders = await userRepository.GetUsersByIdsAsync(senderIds);
        var senderDict = senders.ToDictionary(u => u.Id, u => u);

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
                OtherPersonFirstName = otherUser?.FirstName ?? "",
                OtherPersonLastName = otherUser?.LastName ?? "",
                CreatedAt = conversation.CreatedAt,
                UpdatedAt = conversation.UpdatedAt,
                ClosedAt = conversation.ClosedAt
            },
            Messages = messages.Select(m =>
            {
                var sender = senderDict.GetValueOrDefault(m.SenderId);
                return new ChatMessageDto
                {
                    Id = m.Id.ToString(),
                    ConversationId = m.ConversationId.ToString(),
                    Body = m.Body,
                    SentAt = m.SentAt,
                    SenderId = m.SenderId.ToString(),
                    SenderName = sender == null ? "" : $"{sender.FirstName} {sender.LastName}",
                    IsRead = m.IsRead
                };
            }).ToList()
        };
    }
}
