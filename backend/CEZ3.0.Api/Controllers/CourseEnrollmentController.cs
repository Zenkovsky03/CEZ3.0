using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.CourseEnrollments.Command.EnrolStudent;
using CEZ3._0.Application.CourseEnrollments.Command.UnenrollStudent;
using CEZ3._0.Application.CourseEnrollments.Query.GetEnrollStudents;
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

    /// <summary>Check if current user is enrolled</summary>
    /// <remarks>
    /// Checks the enrollment status of the authenticated user for the specified course.
    /// 
    ///     GET /api/CourseEnrollment/64b1f0e2c3a4e512345abcde/enroll
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
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

    [Authorize]
    [HttpGet("{id}/GetEnrollStudents")]
    [EndpointDescription("Get enrolled students for a course")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetEnrolledStudents([FromRoute] string id)
    {
        try
        {
            var students = await _sender.Send(new GetEnrollStudentsQuery(id));
            return Ok(students);
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

    /// <summary>Enroll student in a course</summary>
    /// <remarks>
    /// Enrolls the authenticated student in the specified course. 
    /// If the course is password protected, the correct password must be provided.
    /// Only users with the **Student** role are authorized.
    /// 
    ///     POST /api/CourseEnrollment/64b1f0e2c3a4e512345abcde/enroll
    ///     {
    ///         "password": "optional_course_password"
    ///     }
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course to enroll in (24-char hex string)</param>
    /// <param name="request">Enrollment request containing an optional password</param>
    [Authorize(Roles = "Student")]
    [HttpPost("{id}/enroll")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
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

    /// <summary>Unenroll student from a course</summary>
    /// <remarks>
    /// Removes the authenticated student's enrollment from the specified course.
    /// Only users with the **Student** role are authorized.
    /// 
    ///     POST /api/CourseEnrollment/64b1f0e2c3a4e512345abcde/unenroll
    /// 
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course to unenroll from (24-char hex string)</param>
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