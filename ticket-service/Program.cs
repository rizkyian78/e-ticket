using Microsoft.EntityFrameworkCore;
using TicketService.Data;

var builder = WebApplication.CreateBuilder(args);

var corsOrigins = builder.Configuration["CORS_ALLOWED_ORIGINS"]
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {

        if (corsOrigins is { Length: > 0 })
        {
            policy.WithOrigins(corsOrigins);
        }
        policy
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔑 Connection string (ASP.NET Core native)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Database connection string is not configured.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend"); // ✅ REQUIRED

app.MapControllers();
app.Run();
