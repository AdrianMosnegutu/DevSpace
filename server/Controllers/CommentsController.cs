using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Repositories;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController(CommentsRepository repository, ILogger<CommentsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Comment>>> GetAllComments(
        [FromQuery] string? sort = null,
        [FromQuery] bool descending = false)
    {
        try
        {
            var comments = sort?.ToLower() switch
            {
                "upvotes" => await repository.GetOrderedByAsync(c => c.Upvotes, descending),
                "date" => await repository.GetOrderedByAsync(c => c.PublishedAt, descending),
                _ => await repository.GetAllAsync()
            };

            return comments.Any() ? Ok(comments) : NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching comments");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when fetching comments");
        }
    }

    [HttpGet("post/{postId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsForPost(Guid postId)
    {
        try
        {
            var comments = await repository.GetCommentsForPostAsync(postId);
            return comments.Any() ? Ok(comments) : NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching comments");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when fetching comments");
        }
    }

    [HttpGet("{commentId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Comment>> GetComment(Guid commentId)
    {
        try
        {
            var comment = await repository.GetByIdAsync(commentId);
            return comment != null ? Ok(comment) : NotFound($"Comment with id '{commentId}' not found.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching comment with id '{CommentId}'", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when fetching comment with id '{commentId}'");
        }
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CreateComment([FromBody] Comment? comment)
    {
        if (comment == null)
        {
            return BadRequest("Comment data is required.");
        }

        try
        {
            // Get the user ID from the JWT token
            var userId = User.FindFirst("sub")?.Value;
            if (userId == null)
            {
                return Unauthorized("User ID not found in token");
            }

            comment.UserId = Guid.Parse(userId);
            await repository.AddAsync(comment);
            return CreatedAtAction(nameof(GetComment), new { commentId = comment.Id }, comment);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when creating comment");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when creating comment");
        }
    }

    [HttpPut("{commentId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateComment(Guid commentId, [FromBody] Comment? comment)
    {
        if (comment == null)
        {
            return BadRequest("Comment data is required.");
        }

        try
        {
            var existingComment = await repository.GetByIdAsync(commentId);
            if (existingComment == null)
            {
                return NotFound($"Comment with id '{commentId}' not found.");
            }

            // Verify that the user owns the comment
            var userId = User.FindFirst("sub")?.Value;
            if (userId == null || existingComment.UserId != Guid.Parse(userId))
            {
                return Unauthorized("You are not authorized to update this comment");
            }

            comment.Id = commentId;
            comment.UserId = existingComment.UserId; // Preserve the original user ID
            await repository.UpdateAsync(comment);
            return Ok(comment);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when updating comment with id '{CommentId}'", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when updating comment with id '{commentId}'");
        }
    }

    [HttpDelete("{commentId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeleteComment(Guid commentId)
    {
        try
        {
            var comment = await repository.GetByIdAsync(commentId);
            if (comment == null)
            {
                return NotFound($"Comment with id '{commentId}' not found.");
            }

            // Verify that the user owns the comment
            var userId = User.FindFirst("sub")?.Value;
            if (userId == null || comment.UserId != Guid.Parse(userId))
            {
                return Unauthorized("You are not authorized to delete this comment");
            }

            await repository.DeleteAsync(comment);
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when deleting comment with id '{CommentId}'", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when deleting comment with id '{commentId}'");
        }
    }

    [HttpPatch("{commentId:guid}/vote")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> VotePost(Guid commentId, [FromBody] int value)
    {
        try
        {
            var comment = await repository.GetByIdAsync(commentId);
            if (comment == null) return NotFound($"Comment with id '{commentId}' not found.");

            await repository.VoteAsync(comment, value);
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when voting the comment with id '{CommentId}'", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when voting the comment with id {commentId}.");
        }
    }
}