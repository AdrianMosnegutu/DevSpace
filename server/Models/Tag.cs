using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public sealed class Tag
{
    [Key] public Guid Id { get; init; } = Guid.NewGuid();

    [Required]
    [MinLength(1)]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public ICollection<PostTag> PostTags { get; init; } = [];
}