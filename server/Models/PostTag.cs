using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public sealed class PostTag
{
    [Key]
    [Column(Order = 0)]
    [ForeignKey(nameof(Post))]
    public Guid PostId { get; set; }

    public Post? Post { get; set; }

    [Key]
    [Column(Order = 1)]
    [ForeignKey(nameof(Tag))]
    public Guid TagId { get; set; }

    public Tag? Tag { get; set; }
}
