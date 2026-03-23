using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Constants.Communication;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Conversations.Command.CloseInquiry
{
    public class CloseInquiryCommandHandler(
        IConversationRepository repository,
        IUserContext userContext) : IRequestHandler<CloseInquiryCommand>
    {
        public async Task Handle(CloseInquiryCommand request, CancellationToken cancellationToken)
        {
            var user = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("Session expired.");

            if (user.role != UserRoles.Teacher.ToString() && user.role != UserRoles.Admin.ToString())
                throw new ForbiddenException("Only teachers can close inquiries.");

            if (!ObjectId.TryParse(request.ConversationId, out var convId))
                throw new BadRequestException("Invalid conversation ID.");

            var conversation = await repository.GetByIdAsync(convId)
                ?? throw new BadRequestException("Conversation not found.");

            if (conversation.Type != ConversationType.Inquiry)
                throw new BadRequestException("Only inquiry-type conversations can be closed.");

            if (conversation.Status == InquirySatus.Closed)
                throw new BadRequestException("Inquiry is already closed.");

            conversation.Status = InquirySatus.Closed;
            conversation.ClosedAt = DateTime.UtcNow;
            conversation.UpdatedAt = DateTime.UtcNow;

            await repository.UpdateAsync(conversation);
        }
    }
}
