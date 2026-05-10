using CEZ3._0.Application.Contracts.Responses.Courses;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Courses.Command.AssignTeacher;
using CEZ3._0.Application.Courses.Command.CreateCourse;
using CEZ3._0.Application.Courses.Command.EditCourse;
using CEZ3._0.Application.Courses.Command.SoftDeleteCourse;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Infrastructure.Presistance;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/courses")]
public class CourseController : ControllerBase
{
    private readonly ISender _sender;
    private readonly CezDbContext _dbContext;

    public CourseController(ISender sender, CezDbContext dbContext)
    {
        _sender = sender;
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _dbContext.Courses
            .Where(c => !c.Archived)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var ownerIds = courses.Select(c => c.OwnerId).Distinct().ToList();
        var owners = await _dbContext.Users
            .Where(u => ownerIds.Contains(u.Id))
            .ToListAsync();

        var courseIds = courses.Select(c => c.Id).ToList();
        var enrollments = await _dbContext.CourseEnrollments
            .Where(e => courseIds.Contains(e.CourseId) && e.IsActive)
            .ToListAsync();

        var payload = courses.Select(course =>
        {
            var owner = owners.FirstOrDefault(o => o.Id == course.OwnerId);
            var participantsCount = enrollments.Count(e => e.CourseId == course.Id);

            return new
            {
                Id = course.Id.ToString(),
                course.Name,
                course.Description,
                course.StartDate,
                course.EndDate,
                course.IsPasswordProtected,
                ParticipantsCount = participantsCount,
                Owner = owner == null
                    ? null
                    : new
                    {
                        Id = owner.Id.ToString(),
                        owner.FirstName,
                        owner.LastName,
                        owner.Email
                    }
            };
        });

        return Ok(payload);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseById([FromRoute] string id)
    {
        if (!ObjectId.TryParse(id, out var courseId))
        {
            return BadRequest(new ErrorResponse { Message = "Invalid course id." });
        }

        var course = await _dbContext.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && !c.Archived);

        if (course == null)
        {
            return NotFound(new ErrorResponse { Message = "Course not found." });
        }

        var owner = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == course.OwnerId);
        var participantsCount = await _dbContext.CourseEnrollments
            .CountAsync(e => e.CourseId == course.Id && e.IsActive);

        return Ok(new
        {
            Id = course.Id.ToString(),
            course.Name,
            course.Description,
            course.StartDate,
            course.EndDate,
            course.IsPasswordProtected,
            ParticipantsCount = participantsCount,
            Owner = owner == null
                ? null
                : new
                {
                    Id = owner.Id.ToString(),
                    owner.FirstName,
                    owner.LastName,
                    owner.Email
                }
        });
    }

    [HttpGet("{id}/sections")]
    public async Task<IActionResult> GetCourseSections([FromRoute] string id)
    {
        if (!ObjectId.TryParse(id, out var courseId))
        {
            return BadRequest(new ErrorResponse { Message = "Invalid course id." });
        }

        var sections = await _dbContext.CourseSections
            .Where(s => s.CourseId == courseId && s.IsActive)
            .OrderBy(s => s.OrderIndex)
            .ToListAsync();

        var sectionIds = sections.Select(s => s.Id).ToList();
        var materials = await _dbContext.SectionMaterials
            .Where(m => sectionIds.Contains(m.SectionId))
            .ToListAsync();

        var payload = sections.Select(section => new
        {
            Id = section.Id.ToString(),
            CourseId = section.CourseId.ToString(),
            section.Title,
            section.OrderIndex,
            section.IsActive,
            section.CreatedAt,
            Materials = materials
                .Where(m => m.SectionId == section.Id)
                .Select(m => new
                {
                    Id = m.Id.ToString(),
                    SectionId = m.SectionId.ToString(),
                    m.Title,
                    m.Content,
                    m.MaterialType,
                    m.CreatedAt
                }),
            Assignments = Array.Empty<object>()
        });

        return Ok(payload);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("create")]
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
            if (!ObjectId.TryParse(teacher.TeacherId, out teacherId))
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
