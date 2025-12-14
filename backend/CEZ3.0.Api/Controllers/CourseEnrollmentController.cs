using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.CourseEnrollments.Command.EnrolStudent;
using CEZ3._0.Application.CourseEnrollments.Command.UnenrollStudent;
using CEZ3._0.Application.Courses.Query.IsUserEnroll;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseEnrollmentController : ControllerBase
{
    private ISender _sender;

    public CourseEnrollmentController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("{id}/enroll")]
    public async Task<IActionResult> IsUserEnrolledInCourse([FromRoute] ObjectId id)
    {
        try
        {
            var isEnrolled = await _sender.Send(new IsUserEnrollQuery(id));
            return Ok(new { IsEnrolled = isEnrolled });
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

    [Authorize(Roles = "Student")]
    [HttpPost("{id}/enroll")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EnrollStudentInCourse([FromRoute] ObjectId id, [FromBody] EnrollStudentRequest request)
    {
        try
        {
            await _sender.Send(new EnrolStudentCommand(id, request.Password));
            return Ok();
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

    [Authorize(Roles = "Student")]
    [HttpPost("{id}/unenroll")]
    public async Task<IActionResult> UnenrollStudentFromCourse([FromRoute] ObjectId id)
    {
        try
        {
            await _sender.Send(new UnenrollStudentCommand(id));
            return Ok();
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
