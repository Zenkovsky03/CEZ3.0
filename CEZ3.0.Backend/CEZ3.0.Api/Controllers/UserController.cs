using CEZ3._0.Application.Contracts.Responses.Users;
using CEZ3._0.Application.Users.Command.CreateUser;
using CEZ3._0.Application.Users.Query.LoginUser;
using CEZ3._0.Domain.Exceptions;
using MediatR;
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

}
