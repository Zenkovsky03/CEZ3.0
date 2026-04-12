using System.Reflection;
using CEZ3._0.Application.Extensions;
using CEZ3._0.Application.Helpers.Scalar;
using CEZ3._0.Infrastructure.Extentions;
using CEZ3._0.Infrastructure.Persistence.Seeders;
using DotNetEnv;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var envPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", ".env");
envPath = Path.GetFullPath(envPath);
if (File.Exists(envPath)) Env.Load(envPath);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();


builder.Services.AddOpenApi("v1", opt =>
{
    opt.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
    
    opt.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        return Task.CompletedTask;
    });
});

builder.Services.AddSwaggerGen(opt =>
{
    opt.EnableAnnotations();
    
    var xmlFile = "CEZ3.0.Api.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    
    if (File.Exists(xmlPath))
    {
        opt.IncludeXmlComments(xmlPath);
    }
});



builder.Services.AddApplication(builder.Configuration);
builder.Services.AddInfrastructure();

var app = builder.Build();

// --- Seeder ---
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var runner = scope.ServiceProvider.GetRequiredService<SeederRunner>();
    await runner.RunAsync();
}

if (app.Environment.IsDevelopment())
{
    // Scalar niech korzysta z nowego standardu
    app.MapOpenApi();
    app.MapScalarApiReference();

    // Swagger niech korzysta ze swojego silnika (który ma wpięte XML)
    app.UseSwagger(); 
    app.UseSwaggerUI(options =>
    {
        // ZMIANA TUTAJ: Wskazujemy na domyślny endpoint Swaggera, nie na Microsoftowy
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "CEZ3.0 v1");
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowAll");
app.MapControllers();

app.Run();