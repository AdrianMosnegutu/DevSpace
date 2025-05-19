using System.Linq.Expressions;

namespace Server.Repositories;

public interface IRepository<TEntity>
{
    Task<IEnumerable<TEntity>> GetAllAsync();

    Task<IEnumerable<TEntity>> GetOrderedByAsync<TKey>(Expression<Func<TEntity, TKey>> key, bool descending = false);

    Task<TEntity?> GetByIdAsync(Guid id);

    Task AddAsync(TEntity entity);

    Task UpdateAsync(TEntity entity);

    Task DeleteAsync(TEntity entity);
}
