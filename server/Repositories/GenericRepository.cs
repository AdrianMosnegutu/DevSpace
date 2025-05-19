using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Repositories;

public class GenericRepository<TEntity>(AppDbContext context) : IRepository<TEntity> where TEntity : class
{
    protected readonly AppDbContext Context = context;

    protected readonly DbSet<TEntity> Set = context.Set<TEntity>();

    public async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await Set.ToListAsync();
    }

    public async Task<IEnumerable<TEntity>> GetOrderedByAsync<TKey>(
        Expression<Func<TEntity, TKey>> keySelector,
        bool descending = false)
    {
        var query = descending
            ? Set.OrderByDescending(keySelector)
            : Set.OrderBy(keySelector);

        return await query.ToListAsync();
    }

    public async Task<TEntity?> GetByIdAsync(Guid id)
    {
        return await Set.FindAsync(id);
    }

    public async Task AddAsync(TEntity entity)
    {
        await Set.AddAsync(entity);
        await Context.SaveChangesAsync();
    }

    public async Task UpdateAsync(TEntity entity)
    {
        Set.Update(entity);
        await Context.SaveChangesAsync();
    }

    public async Task DeleteAsync(TEntity entity)
    {
        Set.Remove(entity);
        await Context.SaveChangesAsync();
    }
}