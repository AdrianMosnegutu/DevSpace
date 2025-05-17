using Server.Data;
using Server.Models;

namespace Server.Repositories;

public sealed class PostsRepository(AppDbContext context) : GenericRepository<Post>(context)
{
    public async Task VoteAsync(Post post, int value)
    {
        post.Upvotes += value;

        Set.Attach(post);
        Context.Entry(post).Property(targetPost => targetPost.Upvotes).IsModified = true;

        await Context.SaveChangesAsync();
    }
}