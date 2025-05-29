using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Linq.Expressions;

namespace Server.Repositories;

public sealed class PostsRepository(AppDbContext context) : GenericRepository<Post>(context)
{
    public override async Task<IEnumerable<Post>> GetAllAsync()
    {
        return await Set
            .Include(p => p.User)
            .ToListAsync();
    }

    public override async Task<Post?> GetByIdAsync(Guid id)
    {
        return await Set
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public override async Task<IEnumerable<Post>> GetOrderedByAsync<TKey>(
        Expression<Func<Post, TKey>> keySelector,
        bool descending = false)
    {
        var query = Set
            .Include(p => p.User);

        query = descending
            ? query.OrderByDescending(keySelector)
            : query.OrderBy(keySelector);

        return await query.ToListAsync();
    }

    public async Task VoteAsync(Post post, int value)
    {
        post.Upvotes += value;

        Set.Attach(post);
        Context.Entry(post).Property(targetPost => targetPost.Upvotes).IsModified = true;

        await Context.SaveChangesAsync();
    }
}