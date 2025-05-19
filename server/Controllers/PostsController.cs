using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Repositories;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PostsController(PostsRepository repository, ILogger<PostsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Post>>> GetAllPosts(
        [FromQuery] string? sort = null,
        [FromQuery] bool descending = false)
    {
        try
        {
            var posts = sort?.ToLower() switch
            {
                "upvotes" => await repository.GetOrderedByAsync(p => p.Upvotes, descending),
                "date" => await repository.GetOrderedByAsync(p => p.PublishedAt, descending),
                _ => await repository.GetAllAsync()
            };

            return posts.Any() ? Ok(posts) : NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching posts");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when fetching posts");
        }
    }

    [HttpGet("{postId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Post>> GetPost(Guid postId)
    {
        try
        {
            var post = await repository.GetByIdAsync(postId);
            return post != null ? Ok(post) : NotFound($"Post with id '{postId}' not found.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching post with id '{PostId}'", postId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when fetching post with id '{postId}'");
        }
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CreatePost([FromBody] Post? post)
    {
        if (post == null) return BadRequest("No post provided.");

        try
        {
            await repository.AddAsync(post);
            return CreatedAtAction(nameof(GetPost), new { postId = post.Id }, post);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when creating a new post");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when creating a new post.");
        }
    }

    [HttpPut("{postId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdatePost(Guid postId, [FromBody] Post post)
    {
        try
        {
            var existingPost = await repository.GetByIdAsync(postId);
            if (existingPost == null) return NotFound($"Post with id '{postId}' not found.");

            existingPost.Title = post.Title;
            existingPost.Body = post.Body;
            existingPost.Upvotes = post.Upvotes;
            existingPost.PublishedAt = DateTime.UtcNow;

            await repository.UpdateAsync(existingPost);
            return Ok(existingPost);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when updating post with id '{PostId}'", postId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when updating post with id '{postId}'.");
        }
    }

    [HttpDelete("{postId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeletePost(Guid postId)
    {
        try
        {
            var post = await repository.GetByIdAsync(postId);
            if (post == null) return NotFound($"Post with id '{postId}' not found.");

            await repository.DeleteAsync(post);
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when deleting post with id '{PostId}'", postId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when deleting the post with id {postId}.");
        }
    }

    [HttpPatch("{postId:guid}/vote")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> VotePost(Guid postId, [FromBody] int value)
    {
        try
        {
            var post = await repository.GetByIdAsync(postId);
            if (post == null) return NotFound($"Post with id '{postId}' not found.");

            await repository.VoteAsync(post, value);
            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when voting the post with id '{PostId}'", postId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when voting the post with id {postId}.");
        }
    }
}