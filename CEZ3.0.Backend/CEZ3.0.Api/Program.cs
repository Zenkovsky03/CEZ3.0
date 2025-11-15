using CEZ3._0.Domain.Entities;
using CEZ3._0.Infrastructure.Extentions;
using CEZ3._0.Infrastructure.Presistance;
using CEZ3._0.Application.Extensions;
using DotNetEnv;
using Scalar.AspNetCore;
using CEZ3._0.Infrastructure.Seeder;

var builder = WebApplication.CreateBuilder(args);
var envPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", ".env");
envPath = Path.GetFullPath(envPath);

Env.Load(envPath);
builder.Configuration.AddEnvironmentVariables();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var g = new MongoSettings
{
    ConnectionString = Environment.GetEnvironmentVariable("MongoDB_URL") ?? "",
    DatabaseName = Environment.GetEnvironmentVariable("MongoDB_DbName") ?? "db",
};

builder.Services.AddApplication(builder.Configuration);
builder.Services.AddInfrastructure(new MongoSettings
{
    ConnectionString = Environment.GetEnvironmentVariable("MongoDB_URL") ?? "",
    DatabaseName = Environment.GetEnvironmentVariable("MongoDB_DbName") ?? "db",
});

var app = builder.Build();

//do przeniesienia do seedera
//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<CezDbContext>();

//    db.Database.EnsureCreated();

//    //if (!db.Users.Any())
//    if (false)
//    {
//        db.Users.Add(new User
//        {
//            FirstName = "Jan",
//            LastName = "Kowalski",
//            Email = "jan.kowalski@example.com",
//            //PasswordHash = "hashed_password_here"
//        });
//        db.SaveChanges();
//    }
//}
using var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<ICez3_0Seeder>();
await seeder.Seed();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
