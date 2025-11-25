using CEZ3._0.Application.Users.Dtos;

namespace CEZ3._0.Application.Interfaces;

public interface IUserContext
{
    public CurrentUser? GetCurrentUser();
}
