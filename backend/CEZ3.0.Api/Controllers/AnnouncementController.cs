using CEZ3._0.Application.Announcements.Command.CreateAnnouncement;
using CEZ3._0.Application.Announcements.Command.DeleteAnnouncement;
using CEZ3._0.Application.Announcements.Command.Query.GetAllAnnouncements;
using CEZ3._0.Application.Announcements.Command.Query.GetAnnouncementById;
using CEZ3._0.Application.Announcements.Command.UpdateAnnouncement;
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

    /// <summary>Create a new announcement</summary>
    /// <remarks>
    /// Creates a new announcement visible to all users in the system.
    /// Only users with the **Admin** or **Teacher** role are authorized.
    ///
    ///     POST /api/announcements/create
    ///     {
    ///         "title": "Upcoming Exam Schedule",
    ///         "content": "Please note that mid-term exams will begin on Monday.",
    ///         "courseId": "64b1f0e2c3a4e512345abcde"
    ///     }
    ///
    /// </remarks>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("create")]
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

    /// <summary>Get an announcement by ID</summary>
    /// <remarks>
    /// Returns a single announcement matching the given ID.
    /// All authenticated users (Admin, Teacher, Student) are authorized.
    ///
    ///     GET /api/announcements/64b1f0e2c3a4e512345abcde
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the announcement (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [Authorize]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
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

    /// <summary>Get a paginated list of announcements</summary>
    /// <remarks>
    /// Returns a paginated list of all announcements, ordered by creation date descending.
    /// All authenticated users (Admin, Teacher, Student) are authorized.
    ///
    ///     GET /api/announcements/list?pageNumber=1&amp;pageSize=5
    ///
    /// Default values: `pageNumber = 1`, `pageSize = 5`.
    /// </remarks>
    /// <param name="pageNumber">1-based index of the page to retrieve. Defaults to `1`.</param>
    /// <param name="pageSize">Number of announcements per page. Defaults to `5`.</param>
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

    /// <summary>Update an announcement</summary>
    /// <remarks>
    /// Updates the title and content of an existing announcement.
    /// Only Admin and Teacher roles are authorized.
    ///
    ///     PUT /api/announcements/{id}
    ///     {
    ///         "title": "Updated Title",
    ///         "content": "Updated content"
    ///     }
    ///
    /// </remarks>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateAnnouncement(string id, [FromBody] UpdateAnnouncementCommand request)
    {
        try
        {
            request.Id = id;
            await _sender.Send(request);
            return Ok(new { Message = "Announcement updated successfully." });
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

    /// <summary>Delete an announcement (soft delete)</summary>
    /// <remarks>
    /// Soft-deletes an announcement by setting IsActive to false.
    /// Only Admin and Teacher roles are authorized.
    ///
    ///     DELETE /api/announcements/{id}
    ///
    /// </remarks>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteAnnouncement(string id)
    {
        try
        {
            await _sender.Send(new DeleteAnnouncementCommand { Id = id });
            return Ok(new { Message = "Announcement deleted successfully." });
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
}