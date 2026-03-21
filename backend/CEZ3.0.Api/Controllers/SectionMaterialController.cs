using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.SectionMaterials.Command.CreateSectionMaterial;
using CEZ3._0.Application.SectionMaterials.Command.DeleteSectionMaterial;
using CEZ3._0.Application.SectionMaterials.Command.EditSectionMaterial;
using CEZ3._0.Application.SectionMaterials.Query.GetCurrentSectionMaterialByCourseSectionId;
using CEZ3._0.Application.SectionMaterials.Query.GetSectionMaterialById;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SectionMaterialController : ControllerBase
{
    private readonly ISender _sender;

    public SectionMaterialController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost]
    [EndpointDescription("Roles = (Admin,Teacher) Creates a new lesson in a module. Order is determined by creation time.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateLesson([FromBody] CreateSectionMaterialCommand request)
    {
        try
        {
            var id = await _sender.Send(request);
            return StatusCode(StatusCodes.Status201Created, new { Message = "Lesson created successfully.", LessonId = id });
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

    [Authorize]
    [HttpPut("{id}")]
    [EndpointDescription("Roles = (Admin) or teacher (owner). Edits lesson title and content.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EditLesson([FromRoute] string id, [FromBody] EditSectionMaterialCommand request)
    {
        try
        {
            request.Id = id;
            await _sender.Send(request);
            return Ok(new SuccessResponse { Message = "Lesson updated successfully." });
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

    [Authorize]
    [HttpDelete("{id}")]
    [EndpointDescription("Roles = (Admin) or teacher (owner). Deletes a lesson.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteLesson([FromRoute] string id)
    {
        try
        {
            await _sender.Send(new DeleteSectionMaterialCommand(id));
            return Ok(new SuccessResponse { Message = "Lesson deleted successfully." });
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

    [Authorize]
    [HttpGet("current/{courseSectionId}")]
    [EndpointDescription("Gets the most recent lesson for a course section. Roles = (Admin, Teacher, Student)")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentLesson([FromRoute] string courseSectionId)
    {
        try
        {
            var lesson = await _sender.Send(new GetCurrentSectionMaterialByCourseSectionIdQuery(courseSectionId));
            return Ok(lesson);
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
        catch (NotFoundException ex)
        {
            return NotFound(new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("{id}")]
    [EndpointDescription("Gets a lesson by its ID. Roles = (Admin, Teacher, Student)")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetLessonById([FromRoute] string id)
    {
        try
        {
            var lesson = await _sender.Send(new GetSectionMaterialByIdQuery(id));
            return Ok(lesson);
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
        catch (NotFoundException ex)
        {
            return NotFound(new ErrorResponse { Message = ex.Message });
        }
    }
}