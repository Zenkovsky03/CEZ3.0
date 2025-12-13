using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.CourseEnrollments.Command.EnrolStudent;
using CEZ3._0.Domain.Exceptions;
using MediatR;
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

    [HttpPost("{id}/enroll")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EnrollStudentInCourse([FromRoute] ObjectId id)
    {
        try
        {
            await _sender.Send(new EnrolStudentCommand(id));
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
}
