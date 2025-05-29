using System.ComponentModel.DataAnnotations;

namespace Server.DTOs;

public record RegisterRequest(
    [Required] [StringLength(50)] string Username,
    [Required] [EmailAddress] [StringLength(100)] string Email,
    [Required] [StringLength(100, MinimumLength = 6)] string Password
);

public record LoginRequest(
    [Required] string Email,
    [Required] string Password
);

public record AuthResponse(
    string Token,
    string Username,
    string Email
); 