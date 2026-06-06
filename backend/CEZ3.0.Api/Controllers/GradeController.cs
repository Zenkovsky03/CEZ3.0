using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Grades.Query.GetMyGrades;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/grades")]
public class GradeController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyGrades([FromQuery] string? courseId = null)
    {
        try
        {
            var grades = await _sender.Send(new GetMyGradesQuery { CourseId = courseId });
            return Ok(grades);
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
