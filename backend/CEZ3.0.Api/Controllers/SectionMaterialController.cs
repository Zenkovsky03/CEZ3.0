using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.SectionMaterials.Command.CreateSectionMaterial;
using CEZ3._0.Application.SectionMaterials.Command.DeleteSectionMaterial;
using CEZ3._0.Application.SectionMaterials.Command.EditSectionMaterial;
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
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    [EndpointDescription("Roles = (Admin) or be owner. Edits lesson title and content.")]
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
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    [EndpointDescription("Roles = (Admin) or be owner.Deletes a lesson.")]
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
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }
}