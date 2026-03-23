using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    /// <summary>Basic health check endpoint</summary>
    /// <remarks>
    /// Returns a simple string to verify if the API is running correctly.
    /// 
    ///     GET /api/Home/hello
    /// 
    /// </remarks>
    [HttpGet("hello")]
    public IActionResult HelloWorld()
    {
        return Ok("Hello World");
    }
}