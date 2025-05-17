using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public sealed class PostTag
{
    [Key]
    [Column(Order = 0)]
    [ForeignKey(nameof(Post))]
    public Guid PostId { get; init; }

    public Post? Post { get; init; }

    [Key]
    [Column(Order = 1)]
    [ForeignKey(nameof(Tag))]
    public Guid TagId { get; init; }

    public Tag? Tag { get; init; }
}
