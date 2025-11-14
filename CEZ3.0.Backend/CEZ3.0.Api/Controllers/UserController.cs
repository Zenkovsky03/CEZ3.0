using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CEZ3._0.Api.Controllers;

[ApiController]
[Route("api/User")]
public class UserController : ControllerBase
{
    private readonly ISender sender;
    public UserController(ISender sender)
    {
        this.sender = sender;
    }


}
