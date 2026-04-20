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

    /// <summary>Start a new conversation</summary>
    /// <remarks>
    /// Creates a new conversation of the specified type and returns its ID.
    /// Two types are supported:
    /// - **Inquiry** (Type: 1) — a student-teacher chat that can be closed by the teacher.
    /// - **Direct** (Type: 2) — a student-student chat that remains open permanently.
    ///
    ///     POST /api/conversation/start
    ///     {
    ///         "type": 1,
    ///         "recipientId": "64b1f0e2c3a4e512345abcde",
    ///         "initialMessage": "Hello, I have a question about chapter 3."
    ///     }
    ///
    /// </remarks>
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

    /// <summary>Add a message to a conversation</summary>
    /// <remarks>
    /// Appends a new message to an existing conversation.
    /// The authenticated user must be a participant of the conversation.
    /// Sending a message to a closed **Inquiry** conversation is not allowed.
    ///
    ///     POST /api/conversation/64b1f0e2c3a4e512345abcde/messages
    ///     {
    ///         "content": "Could you clarify the homework deadline?"
    ///     }
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the conversation (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
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

    /// <summary>Get full conversation history</summary>
    /// <remarks>
    /// Returns the complete message history for the given conversation
    /// and marks all unread messages as read for the authenticated user.
    /// The user must be a participant of the conversation.
    ///
    ///     GET /api/conversation/64b1f0e2c3a4e512345abcde
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the conversation (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
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

    /// <summary>Get all conversations for the current user</summary>
    /// <remarks>
    /// Returns a list of all conversations the authenticated user participates in,
    /// sorted by most recent activity. Possible conversation statuses (in order):
    /// `Open`, `AwaitingTeacherResponse`, `AwaitingStudentResponse`, `Closed`.
    ///
    ///     GET /api/conversation
    ///
    /// </remarks>
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

    /// <summary>Close an inquiry conversation</summary>
    /// <remarks>
    /// Marks an **Inquiry**-type conversation as closed, preventing further messages.
    /// Only the **Teacher** who is a participant of the conversation is authorized.
    /// Attempting to close a **Direct** conversation or an already closed inquiry will return a 400.
    ///
    ///     PATCH /api/conversation/64b1f0e2c3a4e512345abcde/close
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the conversation (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpPatch("{id}/close")]
    [Authorize(Roles = "Teacher")]
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