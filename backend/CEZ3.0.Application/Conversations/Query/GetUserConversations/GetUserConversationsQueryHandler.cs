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

namespace CEZ3._0.Application.Conversations.Query.GetUserConversations
{
    public class GetUserConversationsQueryHandler(
        IConversationRepository repository,
        IUserContext userContext) : IRequestHandler<GetUserConversationsQuery, List<ConversationDto>>
    {
        public async Task<List<ConversationDto>> Handle(GetUserConversationsQuery request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser() ?? throw new UnauthorizedException("Session expired");
            var userId = ObjectId.Parse(user.id);

            var conversations = await repository.GetUserConversationAsync(userId);

            return conversations.Select(c => new ConversationDto
            {
                Id = c.Id.ToString(),
                Title = c.Title,
                Type = (int)c.Type,
                Status = (int)c.Status,
                CreatorId = c.CreatorId.ToString(),
                RecipientId = c.RecipientId.ToString(),
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                ClosedAt = c.ClosedAt
            }).OrderByDescending(c => c.UpdatedAt).ToList();
        }
    }
}
