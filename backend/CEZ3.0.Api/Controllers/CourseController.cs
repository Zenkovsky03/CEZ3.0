using CEZ3._0.Application.Contracts.Responses.Courses;
using CEZ3._0.Application.Contracts.Responses.CourseSection;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Courses.Command.AssignTeacher;
using CEZ3._0.Application.Courses.Command.CreateCourse;
using CEZ3._0.Application.Courses.Command.EditCourse;
using CEZ3._0.Application.Courses.Command.SoftDeleteCourse;
using CEZ3._0.Application.Courses.Query.GetCourseById;
using CEZ3._0.Application.Courses.Query.GetCourses;
using CEZ3._0.Application.Courses.Query.GetCourseSections;
using CEZ3._0.Application.Courses.Query.GetProgressOfCourse;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/courses")]
[Tags("Courses")]
public class CourseController : ControllerBase
{
    private readonly ISender _sender;

    public CourseController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>Get all courses</summary>
    /// <remarks>
    /// Returns a list of all active (non-archived) courses. No authentication required.
    ///
    ///     GET /api/courses
    ///
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CourseResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourses()
    {
        var result = await _sender.Send(new GetCoursesQuery());
        return Ok(result);
    }

    /// <summary>Get course by ID</summary>
    /// <remarks>
    /// Returns a single course matching the provided MongoDB ObjectId.
    ///
    ///     GET /api/courses/64b1f0e2c3a4e512345abcde
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CourseResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCourseById([FromRoute] string id)
    {
        try
        {
            var result = await _sender.Send(new GetCourseByIdQuery(id));
            return Ok(result);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Get sections for a course</summary>
    /// <remarks>
    /// Returns all sections belonging to the given course, ordered by `OrderIndex`.
    ///
    ///     GET /api/courses/64b1f0e2c3a4e512345abcde/sections
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpGet("{id}/sections")]
    [ProducesResponseType(typeof(IEnumerable<CourseSectionResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCourseSections([FromRoute] string id)
    {
        try
        {
            var result = await _sender.Send(new GetCourseSectionsQuery(id));
            return Ok(result);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Create a new course</summary>
    /// <remarks>
    /// Creates a new course. The authenticated user becomes the owner.
    /// Only users with the **Admin** or **Teacher** role are authorized.
    ///
    ///     POST /api/courses/create
    ///     {
    ///         "name": "Introduction to C#",
    ///         "description": "A beginner-friendly course covering C# fundamentals.",
    ///         "startDate": "2025-09-01T00:00:00Z",
    ///         "endDate": "2026-01-31T00:00:00Z",
    ///         "isPasswordProtected": false,
    ///         "password": null
    ///     }
    ///
    /// </remarks>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateCourseResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseCommand request)
    {
        try
        {
            var courseId = await _sender.Send(request);
            return StatusCode(StatusCodes.Status201Created, new CreateCourseResponse
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
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Edit an existing course</summary>
    /// <remarks>
    /// Updates the name, description, and dates of an existing course.
    /// **Admin** can edit any course. **Teacher** can only edit their own courses.
    ///
    ///     PUT /api/courses/64b1f0e2c3a4e512345abcde
    ///     {
    ///         "name": "Advanced C#",
    ///         "description": "Deep dive into advanced C# topics.",
    ///         "startDate": "2025-10-01T00:00:00Z",
    ///         "endDate": "2026-02-28T00:00:00Z"
    ///     }
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course to edit (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [Authorize]
    [HttpPut("{id}")]
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
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Soft-delete a course</summary>
    /// <remarks>
    /// Marks a course as archived (`Archived = true`). The course record is **not** permanently removed.
    /// **Admin** can delete any course. **Teacher** can only delete their own courses.
    ///
    ///     DELETE /api/courses/64b1f0e2c3a4e512345abcde
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course to archive (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [Authorize]
    [HttpDelete("{id}")]
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
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Assign a teacher to a course</summary>
    /// <remarks>
    /// Sets the course owner to the specified teacher. The target user must have the **Teacher** role.
    /// Only users with the **Admin** role are authorized.
    ///
    ///     PATCH /api/courses/64b1f0e2c3a4e512345abcde/assign-teacher
    ///     {
    ///         "teacherId": "64b1f0e2c3a4e512345abcdf"
    ///     }
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpPatch("{id}/assign-teacher")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> AssignTeacherToCourse(
        [FromRoute] string id,
        [FromBody] AssignTeacherRequest request)
    {
        try
        {
            await _sender.Send(new AssignTeacherCommand(id, request.TeacherId));
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
            return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Get course progress for current user</summary>
    /// <remarks>
    /// Returns the completion progress of the authenticated user for the specified course.
    /// Progress is calculated as the ratio of completed sections to total sections.
    ///
    ///     GET /api/courses/64b1f0e2c3a4e512345abcde/progress
    ///
    /// </remarks>
    /// <param name="id">MongoDB ObjectId of the course (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpGet("{id}/progress")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetProgressOfCourse([FromRoute] string id)
    {
        try
        {
            var progress = await _sender.Send(new GetProgressOfCourseQuery(id));
            return Ok(progress);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new ErrorResponse { Message = ex.Message });
        }
        catch (UnauthorizedException ex)
        {
            return StatusCode(StatusCodes.Status401Unauthorized, new ErrorResponse { Message = ex.Message });
        }
    }
}