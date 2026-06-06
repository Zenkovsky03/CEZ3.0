using CEZ3._0.Application.Conversations.DTO;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.Conversations.Query.GetUserConversations;

public class GetUserConversationsQueryHandler(
    IConversationRepository repository,
    IUserContext userContext,
    IUserRepository userRepository) : IRequestHandler<GetUserConversationsQuery, List<ConversationDto>>
{
    public async Task<List<ConversationDto>> Handle(GetUserConversationsQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired");
        var userId = ObjectId.Parse(user.id);

        var conversations = await repository.GetUserConversationAsync(userId);

        var otherUserIds = conversations
            .Select(c => c.CreatorId == userId ? c.RecipientId : c.CreatorId)
            .Distinct()
            .ToList();

        var users = await userRepository.GetUsersByIdsAsync(otherUserIds);
        var userDict = users.ToDictionary(u => u.Id, u => u);

        var result = new List<ConversationDto>();
        foreach (var c in conversations)
        {
            var otherId = c.CreatorId == userId ? c.RecipientId : c.CreatorId;
            var otherUser = userDict.GetValueOrDefault(otherId);

            var messages = await repository.GetMessagesByConversationIdAsync(c.Id);
            var lastMsg = messages.MaxBy(m => m.SentAt);

            result.Add(new ConversationDto
            {
                Id = c.Id.ToString(),
                Title = c.Title,
                Type = (int)c.Type,
                Status = (int)c.Status,
                CreatorId = c.CreatorId.ToString(),
                RecipientId = c.RecipientId.ToString(),
                OtherPersonFirstName = otherUser?.FirstName ?? "",
                OtherPersonLastName = otherUser?.LastName ?? "",
                LastMessage = lastMsg?.Body,
                LastMessageAt = lastMsg?.SentAt,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                ClosedAt = c.ClosedAt
            });
        }

        return result.OrderByDescending(c => c.UpdatedAt).ToList();
    }
}
