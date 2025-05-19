using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Repositories;

public sealed class PostTagsRepository(AppDbContext context)
{
    public async Task<IEnumerable<Tag?>> GetTagsForPostAsync(Guid postId) =>
        await context.PostTags
            .Where(pt => pt.PostId == postId)
            .Select(pt => pt.Tag)
            .ToListAsync();

    public async Task<IEnumerable<Post?>> GetPostsForTags(IEnumerable<Tag> tags) =>
        await context.PostTags
            .Where(pt => tags.Select(t => t.Id).Contains(pt.TagId))
            .Select(pt => pt.Post)
            .Distinct()
            .ToListAsync();

    public async Task AddTagToPostAsync(Guid postId, Guid tagId)
    {
        var exists = await context.PostTags.AnyAsync(pt => pt.PostId == postId && pt.TagId == tagId);
        if (!exists)
        {
            await context.PostTags.AddAsync(new PostTag { PostId = postId, TagId = tagId });
            await context.SaveChangesAsync();
        }
    }

    public async Task RemoveTagFromPostAsync(Guid postId, Guid tagId)
    {
        var postTag = await context.PostTags
            .FirstOrDefaultAsync(pt => pt.PostId == postId && pt.TagId == tagId);

        if (postTag is not null)
        {
            context.PostTags.Remove(postTag);
            await context.SaveChangesAsync();
        }
    }
}