using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Users.Command.BlockUser;
using CEZ3._0.Application.Users.Command.CreateUser;
using CEZ3._0.Application.Users.Command.EditUser;
using CEZ3._0.Application.Users.Command.GetResetToken;
using CEZ3._0.Application.Users.Command.ResetPassword;
using CEZ3._0.Application.Users.Command.SoftDeleteUser;
using CEZ3._0.Application.Users.Command.UnblockUser;
using CEZ3._0.Application.Users.Query.LoginUser;
using CEZ3._0.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OpenApi;

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
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Internal server error" });
        }
    }

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
}
