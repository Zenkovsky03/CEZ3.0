using CEZ3._0.Application.Contracts.Responses.Events;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Events.Command.CreateEvent;
using CEZ3._0.Application.Events.Query.GetEventById;
using CEZ3._0.Application.Events.Query.GetEventsForUser;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/events")]
public class EventController : ControllerBase
{
    private readonly ISender _sender;

    public EventController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>Create a new event</summary>
    /// <remarks>
    /// Creates a new global or course-related event.
    /// Roles: Admin, Teacher.
    /// </remarks>
    /// <param name="command">Event details including title, description, and date</param>
    [HttpPost("create")]
    [EndpointDescription("Roles: Admin, Teacher")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventCommand command)
    {
        try
        {
            var eventId = await _sender.Send(command);

            return StatusCode(StatusCodes.Status201Created, new CreateEventResponse
            {
                Message = "Event created successfully.",
                EventId = eventId
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
            return StatusCode(StatusCodes.Status403Forbidden,
                new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Get event details by ID</summary>
    /// <remarks>
    /// Returns full details of a specific event.
    /// Roles: Admin, Teacher, Student.
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the event</param>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [EndpointDescription("Roles: Admin, Teacher, Student")]
    public async Task<IActionResult> GetEventById(string id)
    {
        try
        {
            var eventDetails = await _sender.Send(new GetEventByIdQuery(id));

            return Ok(eventDetails);
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

    /// <summary>Get list of events for current user</summary>
    /// <remarks>Returns a paginated list of events for the authenticated user.</remarks>
    /// <param name="pageNumber">Page number (default 1)</param>
    /// <param name="pageSize">Number of items per page (default 5)</param>
    [Authorize]
    [HttpGet("list")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAnnouncementsList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
    {
        try
        {
            var events = await _sender.Send(new GetEventsForUserQuery(pageNumber, pageSize));
            return Ok(events);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new ErrorResponse { Message = ex.Message });
        }
    }
}