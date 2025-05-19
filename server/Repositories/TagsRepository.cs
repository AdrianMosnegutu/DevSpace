using Server.Data;
using Server.Models;

namespace Server.Repositories;

public sealed class TagsRepository(AppDbContext context) : GenericRepository<Tag>(context);
