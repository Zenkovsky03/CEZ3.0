using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Forums.Command.CreateThreadReplay;
using CEZ3._0.Application.Forums.Command.DeleteThreadReplay;
using CEZ3._0.Application.Forums.Command.EditThreadReplay;
using CEZ3._0.Application.Forums.Query.GetThreadReplay;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/thread/replay")]
public class ThreadReplayController : ControllerBase
{
    private readonly ISender _sender;

    public ThreadReplayController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize]
    [HttpPost("create")]
    [EndpointDescription("Create a new thread replay.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateThreadReplay([FromBody] CreateThreadReplayCommand command)
    {
        try
        {
            var threadReplayId = await _sender.Send(command);
            return Ok(new { ThreadReplayId = threadReplayId });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden,
                            new ErrorResponse { Message = ex.Message });
        }
    }

    [HttpGet("{threadReplayId}")]
    [EndpointDescription("Get thread replays by thread ID.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetThreadReplayById([FromRoute] string threadReplayId)
    {
        try
        {
            var dtos = await _sender.Send(new GetThreadReplayQuery(threadReplayId));
            return Ok(new { ThreadReplay = dtos });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{threadReplayId}")]
    [EndpointDescription("Delete a thread replay by ID.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteThreadReplayById([FromRoute] string threadReplayId)
    {
        try
        {
            await _sender.Send(new DeleteThreadReplayCommand(threadReplayId));
            return Ok(new SuccessResponse { Message = "Thread replay deleted successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden,
                new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{threadReplayId}/edit")]
    [EndpointDescription("Edit an existing thread replay.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EditThreadReplay([FromRoute] string threadReplayId, [FromBody] EditThreadReplayCommand command)
    {
        try
        {
            command.ThreadReplayId = threadReplayId;
            await _sender.Send(command);
            return Ok(new { Message = "Thread replay edited successfully." });
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message }); }
    }
}
