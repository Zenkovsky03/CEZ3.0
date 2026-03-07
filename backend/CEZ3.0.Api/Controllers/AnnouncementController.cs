using CEZ3._0.Application.Announcements.Command.CreateAnnouncement;
using CEZ3._0.Application.Announcements.Command.Query.GetAllAnnouncements;
using CEZ3._0.Application.Announcements.Command.Query.GetAnnouncementById;
using CEZ3._0.Application.Contracts.Responses.Announcement;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/announcements")]
public class AnnouncementController : ControllerBase
{
    private readonly ISender _sender;

    public AnnouncementController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("create")]
    [EndpointDescription("Roles: Admin, Teacher")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateAnnouncement([FromBody] CreateAnnouncementCommand request)
    {
        try
        {
            var announcementId = await _sender.Send(request);

            return StatusCode(StatusCodes.Status201Created, new CreateAnnouncementResponse
            {
                Message = "Announcement created successfully.",
                AnnouncementId = announcementId
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

    [Authorize]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [EndpointDescription("Roles: Admin, Teacher, Student")]
    public async Task<IActionResult> GetAnnouncementById(string id)
    {
        try
        {
            var announcement = await _sender.Send(new GetAnnouncementByIdQuery(id));
            return Ok(announcement);
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
            var announcements = await _sender.Send(new GetAllAnnouncementsQuery(pageNumber, pageSize));
            return Ok(announcements);
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
