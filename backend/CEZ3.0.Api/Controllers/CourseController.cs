using CEZ3._0.Application.Contracts.Responses.Courses;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Courses.Command.AssignTeacher;
using CEZ3._0.Application.Courses.Command.CreateCourse;
using CEZ3._0.Application.Courses.Command.EditCourse;
using CEZ3._0.Application.Courses.Command.SoftDeleteCourse;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/courses")]
public class CourseController : ControllerBase
{
    private readonly ISender _sender;

    public CourseController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost]
    [EndpointDescription("Roles: Admin, Teacher")]
    [ProducesResponseType(typeof(CreateCourseResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseCommand request)
    {
        try
        {
            var courseId = await _sender.Send(request);
            return StatusCode(StatusCodes.Status201Created, new
            {
                Message = "Course created successfully.",
                CourseId = courseId
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
    [HttpPut("{id}")]
    [EndpointDescription("Roles: Admin (all courses), Teacher/Owner (own courses)")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EditCourse([FromRoute] string id, [FromBody] EditCourseCommand request)
    {
        try
        {
            request.CourseId = id;
            await _sender.Send(request);
            return Ok(new SuccessResponse { Message = "Course updated successfully." });
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
    [HttpDelete("{id}")]
    [EndpointDescription("Roles: Admin (all courses), Teacher/Owner (own courses). Soft delete (Archived = true).")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteCourse([FromRoute] string id)
    {
        try
        {
            await _sender.Send(new SoftDeleteCourseCommand(id));
            return Ok(new SuccessResponse { Message = "Course deleted successfully." });
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

    [HttpPatch("{id}/assign-teacher")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> AssignTeacherToCourse([FromRoute] ObjectId id, [FromBody] AssignTeacherRequest teacher)
    {
        try
        {
            ObjectId teacherId;
            if (ObjectId.TryParse(teacher.TeacherId, out teacherId))
            {
                return BadRequest(new ErrorResponse { Message = "Invalid TeacherId format." });
            }

            await _sender.Send(new AssignTeacherCommand(id, teacherId));
            return Ok(new SuccessResponse { Message = "Teacher assigned to course successfully." });
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