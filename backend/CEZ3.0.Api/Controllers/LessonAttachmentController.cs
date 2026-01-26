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