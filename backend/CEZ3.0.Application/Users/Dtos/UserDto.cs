using MongoDB.Bson;

namespace CEZ3._0.Application.Users.Dtos;

public class UserDto
{
    public ObjectId Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsBlocked { get; set; } = false;
}
