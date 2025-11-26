using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CEZ3._0.Application.Services;

public class UserContext(IHttpContextAccessor httpContext) : IUserContext
{
    private readonly IHttpContextAccessor _httpContext = httpContext;

    public CurrentUser? GetCurrentUser()
    {
        var user = _httpContext.HttpContext?.User
            ?? throw new BadRequestException(nameof(_httpContext.HttpContext.User));

        if (user.Identity == null || !user.Identity.IsAuthenticated)
            return null;

        var id = user.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var email = user.FindFirst(ClaimTypes.Email)!.Value;
        var role = user.FindFirst(ClaimTypes.Role)!.Value;


        return new CurrentUser(id, email, role);
    }
}
