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
