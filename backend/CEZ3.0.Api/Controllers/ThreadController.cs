using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Forums.Command.CloseThread;
using CEZ3._0.Application.Forums.Command.CreateThread;
using CEZ3._0.Application.Forums.Command.DeleteThread;
using CEZ3._0.Application.Forums.Command.EditThread;
using CEZ3._0.Application.Forums.Query.GetFullThead;
using CEZ3._0.Application.Forums.Query.GetThreadsHeader;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/thread")]
public class ThreadController : ControllerBase
{
    private readonly ISender _sender;
    public ThreadController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize]
    [HttpPost("create")]
    [EndpointDescription("Create a new thread.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateThread([FromBody] CreateThreadCommand command)
    {
        try
        {
            var threadId = await _sender.Send(command);
            return Ok(new { ThreadId = threadId });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
    }

    [HttpGet("{threadId}")]
    [EndpointDescription("Get thread details by thread ID.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetThreadById([FromRoute] string threadId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var dto = await _sender.Send(new GetFullTheadQuery(threadId, pageNumber, pageSize));
            return Ok(new { Thread = dto });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
    }

    [HttpGet("headers")]
    [EndpointDescription("Get thread headers with pagination.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetThreadsHeader([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var dtos = await _sender.Send(new GetThreadsHeaderQuery(pageNumber, pageSize));
        return Ok(new { Threads = dtos });
    }

    [Authorize]
    [HttpPost("{threadId}/close")]
    [EndpointDescription("Close a thread by thread ID.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CloseThread([FromRoute] string threadId)
    {
        try
        {
            await _sender.Send(new CloseThreadCommand(threadId));
            return Ok(new { Message = "Thread closed successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("{threadId}/delete")]
    [EndpointDescription("Delete a thread by thread ID.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteThread([FromRoute] string threadId)
    {
        try
        {
            await _sender.Send(new DeleteThreadCommand(threadId));
            return Ok(new { Message = "Thread closed successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{threadId}/edit")]
    [EndpointDescription("Edit an existing thread.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EditThread([FromRoute] string threadId, [FromBody] EditThreadCommand command)
    {
        try
        {
            command.ThreadId = threadId;
            await _sender.Send(command);
            return Ok(new { Message = "Thread edited successfully." });
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message }); }
    }
}
