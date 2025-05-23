using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Server.Data;
using Server.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Homework API", Version = "v1" });
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Inject the database context with Postgres support.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection") ?? ""));

builder.Services.AddScoped<PostsRepository>();
builder.Services.AddScoped<CommentsRepository>();
builder.Services.AddScoped<TagsRepository>();
builder.Services.AddScoped<PostTagsRepository>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Homework API V1");
    });
}

app.MapControllers();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.Run();
