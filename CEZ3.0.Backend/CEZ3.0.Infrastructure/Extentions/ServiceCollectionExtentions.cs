using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CEZ3._0.Infrastructure.Extentions;

public static class ServiceCollectionExtentions
{
    public static void AddInfrastructure(this IServiceCollection services, MongoSettings settings)
    {
        services.AddDbContext<CezDbContext>(options =>
            options.UseMongoDB(settings.ConnectionString, settings.DatabaseName));
    }
}
