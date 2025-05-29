using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Repositories;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TagsController(TagsRepository repository, ILogger<TagsController> logger) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<Tag>>> GetAllTags()
    {
        try
        {
            var tags = await repository.GetAllAsync();
            return tags.Any() ? Ok(tags) : NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching tags");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when fetching tags");
        }
    }

    [HttpGet("{tagId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Tag>> GetTag(Guid tagId)
    {
        try
        {
            var tag = await repository.GetByIdAsync(tagId);
            return tag != null ? Ok(tag) : NotFound($"Tag with id '{tagId}' not found.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when fetching tag with id '{TagId}'", tagId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when fetching tag with id '{tagId}'");
        }
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CreateTag([FromBody] Tag? tag)
    {
        if (tag == null)
        {
            return BadRequest("Tag data is required.");
        }

        try
        {
            await repository.AddAsync(tag);
            return CreatedAtAction(nameof(GetTag), new { tagId = tag.Id }, tag);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when creating tag");
            return StatusCode(StatusCodes.Status500InternalServerError,
                "An unknown error occurred when creating tag");
        }
    }

    [HttpPut("{tagId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> UpdateTag(Guid tagId, [FromBody] Tag? tag)
    {
        if (tag == null)
        {
            return BadRequest("Tag data is required.");
        }

        try
        {
            var existingTag = await repository.GetByIdAsync(tagId);
            if (existingTag == null)
            {
                return NotFound($"Tag with id '{tagId}' not found.");
            }

            tag.Id = tagId;
            await repository.UpdateAsync(tag);
            return Ok(tag);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when updating tag with id '{TagId}'", tagId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when updating tag with id '{tagId}'");
        }
    }

    [HttpDelete("{tagId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeleteTag(Guid tagId)
    {
        try
        {
            var tag = await repository.GetByIdAsync(tagId);
            if (tag == null)
            {
                return NotFound($"Tag with id '{tagId}' not found.");
            }

            await repository.DeleteAsync(tag);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred when deleting tag with id '{TagId}'", tagId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                $"An unknown error occurred when deleting tag with id '{tagId}'");
        }
    }
}