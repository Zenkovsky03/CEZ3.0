using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Domain.Exceptions;
using MediatR;
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

    [HttpPost("create")]
    [EndpointDescription("Create a new thread.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateThread([FromBody] Application.Forums.Command.CreateThread.CreateThreadCommand command)
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
}
