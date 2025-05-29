using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Post
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MinLength(1)]
    [MaxLength(50)]
    public required string Title { get; set; }

    [MaxLength(2000)] public string Body { get; set; } = string.Empty;

    [Range(int.MinValue, int.MaxValue)] public int Upvotes { get; set; }

    [ReadOnly(true)]
    [DataType(DataType.DateTime)]
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

    // User relationship
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    // Navigation properties
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<PostTag> PostTags { get; set; } = [];
}
