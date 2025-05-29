using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Comment
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MinLength(1)]
    [MaxLength(200)]
    public required string Body { get; set; }

    [Range(int.MinValue, int.MaxValue)] public int Upvotes { get; set; }

    [Column(Order = 0)]
    [ForeignKey(nameof(Post))]
    public Guid PostId { get; set; }

    [ReadOnly(true)]
    [DataType(DataType.DateTime)]
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

    public Post? Post { get; set; }

    // User relationship
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
