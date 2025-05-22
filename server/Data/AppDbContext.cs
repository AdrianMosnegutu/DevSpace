using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Post> Posts { get; set; }

    public DbSet<Comment> Comments { get; set; }

    public DbSet<Tag> Tags { get; set; }

    public DbSet<PostTag> PostTags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Model Post entities.
        modelBuilder.Entity<Post>(entity =>
        {
            entity.ToTable("Posts");

            entity.HasKey(p => p.Id);

            entity.Property(p => p.Id)
                .HasDefaultValueSql("uuid_generate_v4()");

            entity.Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(p => p.Body)
                .HasDefaultValue("")
                .HasMaxLength(2000);

            entity.Property(p => p.Upvotes)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(p => p.PublishedAt)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp with time zone");

            entity.HasMany(p => p.Comments)
                .WithOne(c => c.Post)
                .HasForeignKey(c => c.PostId);

            entity.HasMany(p => p.PostTags)
                .WithOne(postTag => postTag.Post)
                .HasForeignKey(pt => pt.PostId);
        });

        // Model Comment entities.
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.ToTable("Comments");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Id)
                .HasDefaultValueSql("uuid_generate_v4()");

            entity.Property(c => c.Body)
                .HasDefaultValue("")
                .HasMaxLength(200);

            entity.Property(c => c.Upvotes)
                .IsRequired()
                .HasDefaultValue(0);

            entity.Property(c => c.PublishedAt)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp with time zone");

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Model Tag entities.
        modelBuilder.Entity<Tag>(entity =>
        {
            entity.ToTable("Tags");

            entity.HasKey(t => t.Id);

            entity.Property(t => t.Id)
                .HasDefaultValueSql("uuid_generate_v4()");

            entity.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasMany(t => t.PostTags)
                .WithOne(pt => pt.Tag)
                .HasForeignKey(pt => pt.TagId);
        });

        // Model PostTag entities.
        modelBuilder.Entity<PostTag>(entity =>
        {
            entity.ToTable("PostTags");

            entity.HasKey(pt => new { pt.PostId, pt.TagId });

            entity.HasOne(pt => pt.Post)
                .WithMany(p => p.PostTags)
                .HasForeignKey(pt => pt.PostId);

            entity.HasOne(pt => pt.Tag)
                .WithMany(t => t.PostTags)
                .HasForeignKey(pt => pt.TagId);
        });
    }
}
