using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Conversations.Command.AddMessage;
using CEZ3._0.Application.Conversations.Command.CloseInquiry;
using CEZ3._0.Application.Conversations.Command.StartConversation;
using CEZ3._0.Application.Conversations.Query.GetConversation;
using CEZ3._0.Application.Conversations.Query.GetUserConversations;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationController : ControllerBase
{
    public ConversationController(ISender sender)
    {
        _sender = sender;
    }

    private readonly ISender _sender;

    [HttpPost("start")]
    [EndpointDescription("Starts a new conversation (Type:1 Inquiry or 2 Direct). Inquiry is student-teacher chat,that can be closed by teacher. Direct is student-student, open all the time. Returns the conversation ID.")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> StartConversation([FromBody] StartConversationCommand command)
    {
        try
        {
            var id = await _sender.Send(command);
            return StatusCode(StatusCodes.Status201Created, new
            {
                Message = "Conversation started successfully.",
                ConversationId = id.ToString()
            });
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
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    [HttpPost("{id}/messages")]
    [EndpointDescription("Adds a new message to an existing conversation.")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> AddMessage([FromRoute] string id, [FromBody] AddMessageCommand command)
    {
        try
        {
            command.ConversationId = id;
            await _sender.Send(command);
            return StatusCode(StatusCodes.Status201Created, new { Message = "Message sent successfully." });
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(403, new ErrorResponse { Message = ex.Message }); }
    }

    [HttpGet("{id}")]
    [EndpointDescription("Gets full conversation history and marks messages as read.")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetConversation([FromRoute] string id)
    {
        try
        {
            var result = await _sender.Send(new GetConversationQuery(id));
            return Ok(result);
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(403, new ErrorResponse { Message = ex.Message }); }
    }

    [HttpGet]
    [EndpointDescription("Gets all conversations for the current user. Status in order: Open, AwaitingTeacherResponse,AwaitingStudentResponse,Closed")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetConversations()
    {
        try
        {
            var result = await _sender.Send(new GetUserConversationsQuery());
            return Ok(result);
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
    }

    [HttpPatch("{id}/close")]
    //[Authorize(Roles = "Teacher")]
    [EndpointDescription("Closes an inquiry conversation. Only accessible by teachers.")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CloseInquiry([FromRoute] string id)
    {
        try
        {
            await _sender.Send(new CloseInquiryCommand(id));
            return NoContent();
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(403, new ErrorResponse { Message = ex.Message }); }
    }
}
