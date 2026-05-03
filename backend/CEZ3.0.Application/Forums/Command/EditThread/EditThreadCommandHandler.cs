using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Forums.Command.EditThread
{
    public class EditThreadCommandHandler(
    IUserContext userContext,
    IThreadRepository threadRepository) : IRequestHandler<EditThreadCommand>
    {
        public async Task Handle(EditThreadCommand request, CancellationToken cancellationToken)
        {
            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in.");

            var currentUserId = ObjectId.Parse(currentUser.id);

            if (!ObjectId.TryParse(request.ThreadId, out var threadId))
                throw new BadRequestException("Invalid Thread ID.");

            var thread = await threadRepository.GetActiveThreadByIdAsync(threadId)
                ?? throw new BadRequestException("Thread not found.");

            if (thread.AuthorId != currentUserId)
                throw new ForbiddenException("You can only edit your own threads.");

            if (!thread.IsOpen)
                throw new BadRequestException("Cannot edit a closed thread.");

            if (request.Title.Length > 100)
                throw new BadRequestException("Thread title cannot exceed 100 characters.");

            if (request.Content.Length > 1000)
                throw new BadRequestException("Thread content cannot exceed 1000 characters.");

            thread.Title = request.Title;
            thread.Content = request.Content;

            await threadRepository.SaveChangesAsync();
        }
    }
}
