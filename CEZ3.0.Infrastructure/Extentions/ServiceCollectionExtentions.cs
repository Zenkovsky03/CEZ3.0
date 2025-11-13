using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CEZ3._0.Infrastructure.Extentions;

public static class ServiceCollectionExtentions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("");
        //services.AddDbContext<>(options => options.UseSqlServer(connectionString));
    }
}
