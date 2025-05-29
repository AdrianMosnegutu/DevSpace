using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserIdToGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_PostTags_Posts_PostId",
                table: "PostTags");

            migrationBuilder.DropForeignKey(
                name: "FK_PostTags_Tags_TagId",
                table: "PostTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tags",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PostTags",
                table: "PostTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Posts",
                table: "Posts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Comments",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Tags",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Tags",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "TagId",
                table: "PostTags",
                newName: "tag_id");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "PostTags",
                newName: "post_id");

            migrationBuilder.RenameIndex(
                name: "IX_PostTags_TagId",
                table: "PostTags",
                newName: "ix_post_tags_tag_id");

            migrationBuilder.RenameColumn(
                name: "Upvotes",
                table: "Posts",
                newName: "upvotes");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Posts",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "Body",
                table: "Posts",
                newName: "body");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Posts",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PublishedAt",
                table: "Posts",
                newName: "published_at");

            migrationBuilder.RenameColumn(
                name: "Upvotes",
                table: "Comments",
                newName: "upvotes");

            migrationBuilder.RenameColumn(
                name: "Body",
                table: "Comments",
                newName: "body");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Comments",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PublishedAt",
                table: "Comments",
                newName: "published_at");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "Comments",
                newName: "post_id");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                newName: "ix_comments_post_id");

            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                table: "Posts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                table: "Comments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "pk_tags",
                table: "Tags",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_post_tags",
                table: "PostTags",
                columns: new[] { "post_id", "tag_id" });

            migrationBuilder.AddPrimaryKey(
                name: "pk_posts",
                table: "Posts",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_comments",
                table: "Comments",
                column: "id");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_posts_user_id",
                table: "Posts",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_user_id",
                table: "Comments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "Users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_username",
                table: "Users",
                column: "username",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_comments_posts_post_id",
                table: "Comments",
                column: "post_id",
                principalTable: "Posts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_comments_users_user_id",
                table: "Comments",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_posts_users_user_id",
                table: "Posts",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_post_tags_posts_post_id",
                table: "PostTags",
                column: "post_id",
                principalTable: "Posts",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_post_tags_tags_tag_id",
                table: "PostTags",
                column: "tag_id",
                principalTable: "Tags",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_comments_posts_post_id",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "fk_comments_users_user_id",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "fk_posts_users_user_id",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "fk_post_tags_posts_post_id",
                table: "PostTags");

            migrationBuilder.DropForeignKey(
                name: "fk_post_tags_tags_tag_id",
                table: "PostTags");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_tags",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "pk_post_tags",
                table: "PostTags");

            migrationBuilder.DropPrimaryKey(
                name: "pk_posts",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "ix_posts_user_id",
                table: "Posts");

            migrationBuilder.DropPrimaryKey(
                name: "pk_comments",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "ix_comments_user_id",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Tags",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Tags",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "tag_id",
                table: "PostTags",
                newName: "TagId");

            migrationBuilder.RenameColumn(
                name: "post_id",
                table: "PostTags",
                newName: "PostId");

            migrationBuilder.RenameIndex(
                name: "ix_post_tags_tag_id",
                table: "PostTags",
                newName: "IX_PostTags_TagId");

            migrationBuilder.RenameColumn(
                name: "upvotes",
                table: "Posts",
                newName: "Upvotes");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "Posts",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "body",
                table: "Posts",
                newName: "Body");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Posts",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "published_at",
                table: "Posts",
                newName: "PublishedAt");

            migrationBuilder.RenameColumn(
                name: "upvotes",
                table: "Comments",
                newName: "Upvotes");

            migrationBuilder.RenameColumn(
                name: "body",
                table: "Comments",
                newName: "Body");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Comments",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "published_at",
                table: "Comments",
                newName: "PublishedAt");

            migrationBuilder.RenameColumn(
                name: "post_id",
                table: "Comments",
                newName: "PostId");

            migrationBuilder.RenameIndex(
                name: "ix_comments_post_id",
                table: "Comments",
                newName: "IX_Comments_PostId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tags",
                table: "Tags",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PostTags",
                table: "PostTags",
                columns: new[] { "PostId", "TagId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Posts",
                table: "Posts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Comments",
                table: "Comments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_PostId",
                table: "Comments",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostTags_Posts_PostId",
                table: "PostTags",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PostTags_Tags_TagId",
                table: "PostTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
