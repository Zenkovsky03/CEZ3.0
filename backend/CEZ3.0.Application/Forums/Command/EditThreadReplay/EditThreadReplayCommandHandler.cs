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

namespace CEZ3._0.Application.Forums.Command.EditThreadReplay
{
    public class EditThreadReplayCommandHandler(
    IUserContext userContext,
    IThreadReplayRepository threadReplayRepository,
    IThreadRepository threadRepository) : IRequestHandler<EditThreadReplayCommand>
    {
        public async Task Handle(EditThreadReplayCommand request, CancellationToken cancellationToken)
        {
            var currentUser = userContext.GetCurrentUser()
                ?? throw new UnauthorizedException("User must be logged in.");

            var currentUserId = ObjectId.Parse(currentUser.id);

            if (!ObjectId.TryParse(request.ThreadReplayId, out var replayId))
                throw new BadRequestException("Invalid Replay ID.");

            var replay = await threadReplayRepository.GetThreadReplayByIdAsync(replayId)
                ?? throw new BadRequestException("Replay not found.");

            if (!replay.IsActive)
                throw new BadRequestException("Replay not found or deleted.");

            if (replay.AuthorId != currentUserId)
                throw new ForbiddenException("You can only edit your own replays.");

            var thread = await threadRepository.GetActiveThreadByIdAsync(replay.ThreadId);
            if (thread != null && !thread.IsOpen)
                throw new BadRequestException("Cannot edit reply in a closed thread.");

            if (request.Content.Length > 500)
                throw new BadRequestException("Thread replay content cannot exceed 500 characters.");

            replay.Content = request.Content;

            await threadReplayRepository.SaveChangesAsync();
        }
    }
}
