using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    [HttpGet("hello")]
    public IActionResult HelloWorld()
    {
        return Ok("Hello World");
    }
}
