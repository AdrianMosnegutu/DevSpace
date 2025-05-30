using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Repositories;

public sealed class CommentsRepository : GenericRepository<Comment>
{
    private readonly AppDbContext _context;

    public CommentsRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task VoteAsync(Comment comment, int value)
    {
        comment.Upvotes += value;

        Set.Attach(comment);
        Context.Entry(comment).Property(targetPost => targetPost.Upvotes).IsModified = true;

        await Context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Comment>> GetCommentsForPostAsync(Guid postId)
    {
        return await _context.Comments
            .Where(c => c.PostId == postId)
            .ToListAsync();
    }
}
