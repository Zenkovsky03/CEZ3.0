using CEZ3._0.Application.Contracts.Responses.CourseSection;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.CourseSections.Command.CreateCourseSection;
using CEZ3._0.Application.CourseSections.Command.DeleteCourseSection;
using CEZ3._0.Application.CourseSections.Command.EditCourseSection;
using CEZ3._0.Application.CourseSections.Command.FinalizedCourse;
using CEZ3._0.Application.CourseSections.Command.RollbackFinalizedCourseSection;
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

    /// <summary>Create a new section for a course</summary>
    /// <remarks>
    /// Adds a new section to the specified course. 
    /// Only users with the **Teacher** role who own the course can perform this action.
    /// 
    ///     POST /api/CourseSection/64b1f0e2c3a4e512345abcde/Create
    ///     {
    ///         "title": "Module 1: Getting Started",
    ///         "orderIndex": 0
    ///     }
    /// 
    /// </remarks>
    /// <param name="courseId">MongoDB ObjectId of the course</param>
    /// <param name="request">Section details (title and ordering)</param>
    [Authorize(Roles = "Teacher")]
    [HttpPost("{courseId}/Create")]
    [ProducesResponseType(typeof(CreateResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
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

    /// <summary>Edit an existing course section</summary>
    /// <remarks>
    /// Updates the title or order of a specific section.
    /// Only the **Teacher** who owns the course can edit its sections.
    /// 
    ///     POST /api/CourseSection/Edit/64b1f0e2c3a4e512345abcdf
    ///     {
    ///         "title": "Updated Module Title",
    ///         "orderIndex": 1
    ///     }
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the section to edit</param>
    /// <param name="request">Updated section details</param>
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

    /// <summary>Delete a course section</summary>
    /// <remarks>
    /// Permanently removes a section from the course.
    /// Only the **Teacher** who owns the course can delete its sections.
    /// 
    ///     DELETE /api/CourseSection/Delete/64b1f0e2c3a4e512345abcdf
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the section to delete</param>
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

    /// <summary>Get section details by ID</summary>
    /// <remarks>
    /// Returns full details of a specific course section. Requires authentication.
    /// 
    ///     GET /api/CourseSection/64b1f0e2c3a4e512345abcdf
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the section</param>
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

    /// <summary>Get all sections for a specific course</summary>
    /// <remarks>
    /// Returns a list of all sections belonging to the given course ID.
    /// 
    ///     GET /api/CourseSection/64b1f0e2c3a4e512345abcde/sections
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course</param>
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

    /// <summary>Rollback a finalized section</summary>
    /// <remarks>
    /// Reverts a section from 'Finalized' status to 'In Progress'. 
    /// Authorized for **Admin** or the **Teacher** who owns the course.
    /// 
    ///     POST /api/CourseSection/RollbackFinalized/64b1f0e2c3a4e512345abcdf
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the section to rollback</param>
    [Authorize]
    [HttpPost("RollbackFinalized/{id}")]
    [EndpointDescription("Roles: Teacher, Admin. Owner of course finalized or unfinalized course.")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> RollbackFinalizedCourseSection([FromRoute] string id)
    {
        try
        {
            var command = new RollbackFinalizedCourseSectionCommand(id);
            var sectionId = await _sender.Send(command);
            return Ok(sectionId);
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

    /// <summary>Finalize a course section</summary>
    /// <remarks>
    /// Marks a section as completed/finalized. 
    /// Authorized for **Admin** or the **Teacher** who owns the course.
    /// 
    ///     POST /api/CourseSection/Finalize/64b1f0e2c3a4e512345abcdf
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the section to finalize</param>
    [Authorize]
    [HttpPost("Finalize/{id}")]
    [EndpointDescription("Roles: Teacher, Admin. Owner of course finalized or unfinalized course.")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> FinalizeCourseSection([FromRoute] string id)
    {
        try
        {
            var command = new FinalizedCourseSectionCommand(id);
            var sectionId = await _sender.Send(command);
            return Ok(sectionId);
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