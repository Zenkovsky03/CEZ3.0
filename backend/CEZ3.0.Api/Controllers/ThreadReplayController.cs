using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Forums.Command.CreateThreadReplay;
using CEZ3._0.Domain.Exceptions;
using MediatR;
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
}
