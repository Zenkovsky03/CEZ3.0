using CEZ3._0.Application.Helpers;
using CEZ3._0.Application.Interfaces;
using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Constants.Roles;
using CEZ3._0.Domain.Exceptions;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Users.Query.GetUsersList;

public class GetUsersListQueryHandler(ILogger<GetUsersListQueryHandler> logger,
    IUserContext userContext,
    IUserRepository userRepository) : IRequestHandler<GetUsersListQuery, PagedResult<UserDto>>
{
    private readonly ILogger<GetUsersListQueryHandler> _logger = logger;
    private readonly IUserContext _userContext = userContext;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<PagedResult<UserDto>> Handle(GetUsersListQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetUsersListQuery for admin user");

        var currentUser = _userContext.GetCurrentUser();
        if (currentUser == null)
            throw new UnauthorizedException("User is not authenticated.");

        if (currentUser.role != UserRoles.Admin.ToString())
            throw new ForbiddenException("User does not have permission to access this resource.");

        var users = await _userRepository.GetUsersAsync(request.PageNumber, request.PageSize, request.OrderBy, request.IsActive, request.Role, request.Email);

        var totalUsers = await _userRepository.GetTotalUsersCountAsync();

        var userDto = users.Select(user => new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            IsBlocked = user.IsBlocked
        }).ToList();

        var pagedResult = new PagedResult<UserDto>(userDto, totalUsers, request.PageNumber, request.PageSize);

        return pagedResult;
    }
}
