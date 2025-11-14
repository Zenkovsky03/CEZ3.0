using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace CEZ3._0.Domain.Entities;

public class User
{
    [BsonId]
    public ObjectId Id { get; set; }
    [MaxLength(50)]
    public string FirstName { get; set; } = default!;
    [MaxLength(50)]
    public string LastName { get; set; } = default!;
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = default!;
    [Required]
    [EmailAddress]
    [MaxLength(50)]
    public string Email { get; set; } = default!;
    [Required]
    public string PasswordHash { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    //public Course Course { get; set; } = default!;
    //public CourseEnrollment CourseEnrollment { get; set; } = default!;
    //public Grade Student { get; set; } = default!;
    //public Grade Grader { get; set; } = default!;
    //public Message Sender { get; set; } = default!;
    //public Message Recipient { get; set; } = default!;
}
