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
    public async Task<ActionResult<Post>> GetComment(Guid commentId)
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
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CreateComment([FromBody] Comment? comment)
    {
        if (comment == null) return BadRequest("No comment provided.");

        try
        {
            await repository.AddAsync(comment);
            return CreatedAtAction(nameof(GetComment), new { commentId = comment.Id }, comment);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when creating a new comment");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when creating a new comment.");
        }
    }

    [HttpPut("{commentId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdatePost(Guid commentId, [FromBody] Comment comment)
    {
        try
        {
            var existingComment = await repository.GetByIdAsync(commentId);
            if (existingComment == null) return NotFound($"Comment with id '{commentId}' not found.");

            comment.Body = existingComment.Body;
            comment.Upvotes = existingComment.Upvotes;
            existingComment.PublishedAt = DateTime.UtcNow;

            await repository.UpdateAsync(existingComment);
            return Ok(existingComment);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when updating comment with id '{CommentId}'", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when updating comment with id '{commentId}'.");
        }
    }

    [HttpDelete("{commentId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeletePost(Guid commentId)
    {
        try
        {
            var comment = await repository.GetByIdAsync(commentId);
            if (comment == null) return NotFound($"Comment with id '{commentId}' not found.");

            await repository.DeleteAsync(comment);
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when deleting comment with id '{CommentId}'", commentId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when deleting the comment with id {commentId}.");
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