using CEZ3._0.Application.Users.Dtos;
using CEZ3._0.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CEZ3._0.Application.Users.Query.GetUsersByRoleList;

public class GetUsersByRoleListQueryHandler(ILogger<GetUsersByRoleListQueryHandler> logger,
    IUserRepository userRepository) : IRequestHandler<GetUsersByRoleListQuery, List<UserDto>>
{
    private readonly ILogger<GetUsersByRoleListQueryHandler> _logger = logger;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<List<UserDto>> Handle(GetUsersByRoleListQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling GetUsersByRoleListQuery for role: {Role}", request.Role);

        var users = await _userRepository.GetUsersByRoleAsync(request.Role);

        var dtoList = users.Select(user => new UserDto
        {
            Id = user.Id.ToString(),
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            IsBlocked = user.IsBlocked
        }).ToList();

        return dtoList;
    }
}
