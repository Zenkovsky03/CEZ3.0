using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using CEZ3._0.Infrastructure.Repositories;
using CEZ3._0.Infrastructure.Seeder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CEZ3._0.Infrastructure.Extentions;

public static class ServiceCollectionExtentions
{
    public static void AddInfrastructure(this IServiceCollection services, MongoSettings settings)
    {
        services.AddDbContext<CezDbContext>(options =>
            options.UseMongoDB(settings.ConnectionString, settings.DatabaseName));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICez3_0Seeder, Cez3_0Seeder>();
    }
}
