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

    [HttpPost("login")]
    [EndpointSummary("Zaloguj użytkownika")]
    [EndpointDescription("Uwierzytelnia użytkownika i zwraca JWT token.\n\n**Przykład request body:**\n```json\n{\n  \"login\": \"jan.kowalski\",\n  \"password\": \"Haslo123!\"\n}\n```")]
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

    [HttpPost("register")]
    [EndpointSummary("Zarejestruj nowego użytkownika")]
    [EndpointDescription("Tworzy konto użytkownika z rolą Student (domyślna).\n\n**Przykład request body:**\n```json\n{\n  \"firstName\": \"Jan\",\n  \"lastName\": \"Kowalski\",\n  \"username\": \"jan.kowalski\",\n  \"email\": \"jan@example.com\",\n  \"password\": \"Haslo123!\"\n}\n```")]
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

    [HttpGet("ByRole")]
    public async Task<IActionResult> GetUsersByRole([FromQuery] string r)
    {
        var users = await _sender.Send(new GetUsersByRoleListQuery(r));

        return Ok(users);
    }
}
