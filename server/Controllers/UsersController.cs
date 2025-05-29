using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Repositories;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UsersController(GenericRepository<User> repository, ILogger<UsersController> logger) : ControllerBase
{
    [HttpGet("{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<User>> GetUserById(Guid userId)
    {
        try
        {
            var user = await repository.GetByIdAsync(userId);
            return user != null ? Ok(user) : NotFound($"User with id '{userId}' not found.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching user with id '{UserId}'", userId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when fetching user with id '{userId}'");
        }
    }
} 