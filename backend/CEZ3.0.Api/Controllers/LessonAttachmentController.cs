using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.LessonAttachments.Command.AddLessonAttachment;
using CEZ3._0.Application.LessonAttachments.Command.DeleteLessonAttachment;
using CEZ3._0.Application.LessonAttachments.DTO;
using CEZ3._0.Application.LessonAttachments.Query.GetLessonAttachments;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonAttachmentController : ControllerBase
{
    private readonly ISender _sender;

    public LessonAttachmentController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>Get all attachments for a specific lesson</summary>
    /// <remarks>
    /// Returns a list of all resources attached to a lesson.
    /// 
    ///     GET /api/LessonAttachment/lessons/64b1f0e2c3a4e512345abcdf/attachments
    /// 
    /// </remarks>
    /// <param name="lessonId">MongoDB ObjectId of the lesson</param>
    [Authorize]
    [HttpGet("lessons/{lessonId}/attachments")]
    [EndpointDescription("Gets all attachments for a specific lesson.")]
    [ProducesResponseType(typeof(IEnumerable<LessonAttachmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAttachments([FromRoute] string lessonId)
    {
        try
        {
            var result = await _sender.Send(new GetLessonAttachmentsQuery(lessonId));
            return Ok(result);
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

    /// <summary>Add an attachment to a lesson</summary>
    /// <remarks>
    /// Attaches a link-based resource (Video, PDF, Image, or Link) to a lesson.
    /// Roles: Admin or Teacher (Course Owner).
    /// 
    ///     POST /api/LessonAttachment/lessons/64b1f0e2c3a4e512345abcdf/attachments
    ///     {
    ///         "title": "Course Slides",
    ///         "url": "https://example.com/slides.pdf",
    ///         "type": 1
    ///     }
    /// 
    /// Type Mapping: 0 = Video, 1 = Pdf, 2 = Image, 3 = Link.
    /// </remarks>
    /// <param name="lessonId">MongoDB ObjectId of the lesson</param>
    /// <param name="request">Attachment details including Title, URL and Type</param>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("lessons/{lessonId}/attachments")]
    [EndpointDescription("Roles: (Admin) or teacher (Owner). Adds an link attachment (Video = 0/Pdf = 1/Image = 2/Link = 3) to a lesson. Write number in type")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> AddAttachment([FromRoute] string lessonId, [FromBody] AddLessonAttachmentCommand request)
    {
        try
        {
            request.LessonId = lessonId;

            var attachmentId = await _sender.Send(request);

            return StatusCode(StatusCodes.Status201Created, new
            {
                Message = "Attachment added successfully.",
                AttachmentId = attachmentId
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

    /// <summary>Delete a lesson attachment</summary>
    /// <remarks>
    /// Permanently removes an attachment by its ID.
    /// Roles: Admin or Teacher (Course Owner).
    /// 
    ///     DELETE /api/LessonAttachment/attachments/64b1f0e2c3a4e512345abc00
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the attachment to delete</param>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete("attachments/{id}")]
    [EndpointDescription("Roles: Admin, Teacher (Owner). Deletes an attachment.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteAttachment([FromRoute] string id)
    {
        try
        {
            await _sender.Send(new DeleteLessonAttachmentCommand(id));
            return Ok(new SuccessResponse { Message = "Attachment deleted successfully." });
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