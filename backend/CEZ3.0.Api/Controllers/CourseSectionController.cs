using CEZ3._0.Application.Contracts.Responses.CourseSection;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.CourseSections.Command.CreateCourseSection;
using CEZ3._0.Application.CourseSections.Command.DeleteCourseSection;
using CEZ3._0.Application.CourseSections.Command.EditCourseSection;
using CEZ3._0.Application.CourseSections.Query.GetCourseSectionById;
using CEZ3._0.Application.CourseSections.Query.GetCourseSectionForCourse;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseSectionController : ControllerBase
{
    private readonly ISender _sender;

    public CourseSectionController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize(Roles = "Teacher")]
    [HttpPost("{courseId}/Create")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateCourseSection([FromRoute] string courseId, [FromBody] CreateCourseSectionRequest request)
    {
        try
        {
            var command = new CreateCourseSectionCommand
            {
                CourseId = courseId,
                Title = request.Title,
                OrderIndex = request.OrderIndex
            };
            var sectionId = await _sender.Send(command);
            return Ok(new CreateResponse()
            {
                CourseSectionId = sectionId
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

    [Authorize(Roles = "Teacher")]
    [HttpPost("Edit/{id}")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EditCourseSection([FromRoute] string id, [FromBody] EditCourseSectionRequest request)
    {
        try
        {
            var command = new EditCourseSectionCommand
            {
                Title = request.Title,
                OrderIndex = request.OrderIndex,
                CourseSectionId = id
            };
            var sectionId = await _sender.Send(command);
            return Ok(new EditResponse()
            {
                CourseSectionId = sectionId
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

    [Authorize(Roles = "Teacher")]
    [HttpDelete("Delete/{id}")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteCourseSection([FromRoute] string id)
    {
        try
        {
            await _sender.Send(new DeleteCourseSectionCommand { CourseSectionId = id });
            return NoContent();
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
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCourseSectionById([FromRoute] string id)
    {
        try
        {
            var query = new GetCourseSectionByIdQuery(id);
            var courseSection = await _sender.Send(query);
            return Ok(courseSection);
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
        catch (NotFoundException ex)
        {
            return NotFound(new ErrorResponse { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("{id}/sections")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetCourseSectionsByCourseId([FromRoute] string id)
    {
        try
        {
            var query = new GetCourseSectionForCourseQuery(id);
            var courseSections = await _sender.Send(query);
            return Ok(courseSections);
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
