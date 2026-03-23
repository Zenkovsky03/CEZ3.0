using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Users.Command.BlockUser;
using CEZ3._0.Application.Users.Command.ChangeUserRole;
using CEZ3._0.Application.Users.Command.CreateUser;
using CEZ3._0.Application.Users.Command.EditUser;
using CEZ3._0.Application.Users.Command.GetResetToken;
using CEZ3._0.Application.Users.Command.ResetPassword;
using CEZ3._0.Application.Users.Command.SoftDeleteUser;
using CEZ3._0.Application.Users.Command.UnblockUser;
using CEZ3._0.Application.Users.Query.GetUsersByRoleList;
using CEZ3._0.Application.Users.Query.GetUsersList;
using CEZ3._0.Application.Users.Query.LoginUser;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly ISender _sender;
    public UserController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>Authenticate user and return JWT token</summary>
    /// <param name="request">Login credentials (email and password)</param>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Login([FromBody] LoginUserQuery request)
    {
        try
        {
            var token = await _sender.Send(request);
            return Ok(new { Token = token });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    /// <summary>Register a new user account</summary>
    /// <param name="request">User registration details</param>
    [HttpPost("register")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] CreateUserCommand request)
    {
        try
        {
            await _sender.Send(request);

            return StatusCode(201, new { Message = "User created successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    /// <summary>Generate a password reset token</summary>
    /// <param name="request">User email for token generation</param>
    [HttpPost("getreset")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetResetToken([FromBody] GetResetTokenCommand request)
    {
        try
        {
            await _sender.Send(request);
            return StatusCode(201, new { Message = "Reset token generated successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    /// <summary>Reset password using a valid token</summary>
    /// <param name="request">Token and new password details</param>
    [HttpPost("resetpassword")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand request)
    {
        try
        {
            await _sender.Send(request);
            return Ok(new { Message = "Password reset successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    /// <summary>Block a user account (Admin only)</summary>
    /// <param name="userId">ID of the user to block</param>
    [Authorize(Roles = "Admin")]
    [HttpPatch("block/{userId}")]
    [EndpointDescription("Role: Admin")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> BlockUser([FromRoute] string userId)
    {
        try
        {
            await _sender.Send(new BlockUserCommand(userId));

            return Ok(new { Message = "User blocked successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden,
                new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Unblock a user account (Admin only)</summary>
    /// <param name="userId">ID of the user to unblock</param>
    [Authorize(Roles = "Admin")]
    [HttpPatch("unblock/{userId}")]
    [EndpointDescription("Role: Admin")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UnblockUser([FromRoute] string userId)
    {
        try
        {
            await _sender.Send(new UnblockUserCommand(userId));

            return Ok(new { Message = "User unblocked successfully." });
        }
        catch (BadRequestException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
        catch (ForbiddenException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden,
                new ErrorResponse { Message = ex.Message });
        }
    }

    /// <summary>Edit user profile data</summary>
    /// <remarks>Users can edit their own profiles; Admins can edit anyone.</remarks>
    /// <param name="id">ID of the user to edit</param>
    /// <param name="request">Updated user information</param>
    [Authorize]
    [HttpPut("{id}")]
    [EndpointDescription("Users can change themselves, Admin can change everyone")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> EditUser([FromRoute] string id, [FromBody] EditUserCommand request)
    {
        try
        {
            request.UserId = id;
            await _sender.Send(request);
            return Ok(new SuccessResponse { Message = "Profile updated successfully." });
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

    /// <summary>Perform a soft delete on a user (Admin only)</summary>
    /// <param name="id">ID of the user to soft delete</param>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    [EndpointDescription("Role: Admin")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> SoftDeleteUser([FromRoute] string id)
    {
        try
        {
            var command = new SoftDeleteUserCommand
            {
                UserId = id
            };

            await _sender.Send(command);
            return Ok(new SuccessResponse { Message = "User soft deleted successfully." });
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

    /// <summary>Get paginated list of all users (Admin only)</summary>
    /// <param name="query">Pagination and filter parameters</param>
    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersListQuery query)
    {
        try
        {
            var result = await _sender.Send(query);
            return Ok(result);
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
        catch (ForbiddenException ex)
        {
            return Forbid(ex.Message);
        }
    }

    /// <summary>Change a user's role (Admin only)</summary>
    /// <param name="id">ID of the user</param>
    /// <param name="request">The new role to assign</param>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/role")]
    [EndpointDescription("Role: Admin. Change user role (Admin/Professor/Student).")]
    [ProducesResponseType(typeof(SuccessResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ChangeUserRole([FromRoute] string id, [FromBody] ChangeUserRoleCommand request)
    {
        try
        {
            request.UserId = id;
            await _sender.Send(request);
            return Ok(new SuccessResponse { Message = "User role updated successfully." });
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

    /// <summary>Get list of users filtered by specific role</summary>
    /// <param name="r">Role name (e.g., Student, Teacher)</param>
    [HttpGet("ByRole")]
    public async Task<IActionResult> GetUsersByRole([FromQuery] string r)
    {
        var users = await _sender.Send(new GetUsersByRoleListQuery(r));

        return Ok(users);
    }
}