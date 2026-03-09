using CEZ3._0.Application.Assignments.Command.CreateAssignment;
using CEZ3._0.Application.Assignments.Command.FinishQuiz;
using CEZ3._0.Application.Assignments.Command.SaveSelection;
using CEZ3._0.Application.Assignments.Command.StartAssignment;
using CEZ3._0.Application.Assignments.Dtos;
using CEZ3._0.Application.Assignments.Query.GetAssignmentResults;
using CEZ3._0.Application.Assignments.Query.GetQuiz;
using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController(ISender mediator) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Teacher")]
    [EndpointDescription("Roles: Teacher. Creates a new assignment (Quiz or Test).")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentCommand command)
    {
        try
        {
            var id = await mediator.Send(command);
            return StatusCode(StatusCodes.Status201Created, new { id });
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message }); }
    }

    [HttpPost("{assignmentId}/start")]
    [Authorize(Roles = "Student")]
    [EndpointDescription("Roles: Student. Starts a new assignment attempt.")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StartAssignment(string assignmentId)
    {
        try
        {
            var attemptId = await mediator.Send(new StartAssignmentCommand { AssignmentId = assignmentId });
            return Ok(new { attemptId });
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
    }

    [HttpGet("{attemptId}/solve")]
    [Authorize(Roles = "Student")]
    [EndpointDescription("Roles: Student. Fetches quiz questions without correct answers.")]
    [ProducesResponseType(typeof(StudentQuizDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetQuizForStudent(string attemptId)
    {
        try
        {
            var result = await mediator.Send(new GetQuizQuery { AttemptId = attemptId });
            return Ok(result);
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
    }

    [HttpPost("save-selection")]
    [Authorize(Roles = "Student")]
    [EndpointDescription("Roles: Student. Saves current answer selection for a specific question.")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SaveSelection([FromBody] SaveSelectionCommand command)
    {
        try
        {
            await mediator.Send(command);
            return NoContent();
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
    }

    [HttpPost("{attemptId}/finish")]
    [Authorize(Roles = "Student")]
    [EndpointDescription("Roles: Student. Finishes the attempt, calculates score and creates a grade if TaskType is 'Test'.")]
    [ProducesResponseType(typeof(QuizResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> FinishQuiz(string attemptId)
    {
        try
        {
            if (!ObjectId.TryParse(attemptId, out var objectId))
                return BadRequest(new ErrorResponse { Message = "Invalid Attempt ID format." });

            var result = await mediator.Send(new FinishQuizCommand { AttemptId = objectId });
            return Ok(result);
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
    }

    [HttpGet("{assignmentId}/results")]
    [Authorize(Roles = "Teacher")]
    [EndpointDescription("Roles: Teacher. Fetches all student results for a specific assignment.")]
    [ProducesResponseType(typeof(List<AssignmentResultDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetResults(string assignmentId)
    {
        try
        {
            var results = await mediator.Send(new GetAssignmentResultsQuery { AssignmentId = assignmentId });
            return Ok(results);
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse { Message = ex.Message }); }
    }
}