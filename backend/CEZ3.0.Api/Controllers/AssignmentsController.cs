using CEZ3._0.Application.Assignments.Command.CreateAssignment;
using CEZ3._0.Application.Assignments.Command.FinishQuiz;
using CEZ3._0.Application.Assignments.Command.SaveSelection;
using CEZ3._0.Application.Assignments.Command.StartAssignment;
using CEZ3._0.Application.Assignments.Dtos;
using CEZ3._0.Application.Assignments.Query.GetAssignmentResults;
using CEZ3._0.Application.Assignments.Query.GetNearestAssignments;
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
    /// <summary>Create a new assignment</summary>
    /// <remarks>
    /// Creates a new assignment of type Quiz or Test for a given course.
    /// Only users with the **Teacher** role are authorized.
    ///
    ///     POST /api/assignments
    ///     {
    ///         "title": "Chapter 3 Quiz",
    ///         "taskType": "Quiz",
    ///         "courseId": "64b1f0e2c3a4e512345abcde",
    ///         "questions": [
    ///             {
    ///                 "text": "What is 2 + 2?",
    ///                 "answers": ["3", "4", "5"],
    ///                 "correctAnswerIndex": 1
    ///             }
    ///         ]
    ///     }
    ///
    /// </remarks>
    [HttpPost]
    [Authorize(Roles = "Teacher")]
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

    /// <summary>Start an assignment attempt</summary>
    /// <remarks>
    /// Creates a new attempt for the given assignment and returns the attempt ID.
    /// Only users with the **Student** role are authorized.
    /// A student may only have one active attempt per assignment at a time.
    ///
    ///     POST /api/assignments/64b1f0e2c3a4e512345abcde/start
    ///
    /// </remarks>
    /// <param name="assignmentId">MongoDB ObjectId of the assignment (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpPost("{assignmentId}/start")]
    [Authorize(Roles = "Student")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
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

    /// <summary>Get quiz questions for an active attempt</summary>
    /// <remarks>
    /// Returns the full list of questions for the given attempt, **without** correct answer information.
    /// Only users with the **Student** role are authorized.
    /// The attempt must be in an active (not finished) state.
    ///
    ///     GET /api/assignments/64b1f0e2c3a4e512345abcde/solve
    ///
    /// </remarks>
    /// <param name="attemptId">MongoDB ObjectId of the active attempt (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpGet("{attemptId}/solve")]
    [Authorize(Roles = "Student")]
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

    /// <summary>Save an answer selection for a question</summary>
    /// <remarks>
    /// Persists the student's currently selected answer for a specific question within an active attempt.
    /// Can be called multiple times to update the selection before finishing.
    /// Only users with the **Student** role are authorized.
    ///
    ///     POST /api/assignments/save-selection
    ///     {
    ///         "attemptId": "64b1f0e2c3a4e512345abcde",
    ///         "questionId": "64b1f0e2c3a4e512345abcdf",
    ///         "selectedAnswerIndex": 2
    ///     }
    ///
    /// </remarks>
    [HttpPost("save-selection")]
    [Authorize(Roles = "Student")]
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

    /// <summary>Finish an assignment attempt</summary>
    /// <remarks>
    /// Finalizes the attempt, evaluates all saved answer selections and computes the score.
    /// If the assignment's `TaskType` is **Test**, a grade is automatically created and persisted.
    /// This action is **irreversible** — the attempt cannot be reopened after finishing.
    /// Only users with the **Student** role are authorized.
    ///
    ///     POST /api/assignments/64b1f0e2c3a4e512345abcde/finish
    ///
    /// </remarks>
    /// <param name="attemptId">MongoDB ObjectId of the active attempt (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpPost("{attemptId}/finish")]
    [Authorize(Roles = "Student")]
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

    /// <summary>Get all student results for an assignment</summary>
    /// <remarks>
    /// Returns a list of completed attempt results for every student who finished the given assignment.
    /// Only the **Teacher** who owns the assignment is authorized to view its results.
    ///
    ///     GET /api/assignments/64b1f0e2c3a4e512345abcde/results
    ///
    /// </remarks>
    /// <param name="assignmentId">MongoDB ObjectId of the assignment (24-char hex string), e.g. `64b1f0e2c3a4e512345abcde`</param>
    [HttpGet("{assignmentId}/results")]
    [Authorize(Roles = "Teacher")]
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

    [HttpGet("getNearestAssignments")]
    [EndpointDescription("Get nearest assignmets to dashboard calendar")]
    [Authorize]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetNearestAssignments()
    {
        try
        {
            var result = await mediator.Send(new GetNearestAssignmentsQuery());
            return Ok(result);
        }
        catch (BadRequestException ex) { return BadRequest(new ErrorResponse { Message = ex.Message }); }
        catch (UnauthorizedException ex) { return Unauthorized(new ErrorResponse { Message = ex.Message }); }
    }
}