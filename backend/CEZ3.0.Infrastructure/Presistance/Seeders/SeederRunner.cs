using Microsoft.Extensions.Logging;

namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public class SeederRunner
{
    private readonly IEnumerable<ISeeder> _seeders;
    private readonly ILogger<SeederRunner> _logger;

    public SeederRunner(IEnumerable<ISeeder> seeders, ILogger<SeederRunner> logger)
    {
        _seeders = seeders;
        _logger = logger;
    }

    public async Task RunAsync(CancellationToken cancellationToken = default)
    {
        var ordered = _seeders.OrderBy(s => s.Order).ToList();

        _logger.LogInformation("Starting database seeding. {Count} seeders registered.", ordered.Count);

        foreach (var seeder in ordered)
        {
            var name = seeder.GetType().Name;
            try
            {
                _logger.LogInformation("Running seeder: {Seeder}", name);
                await seeder.SeedAsync(cancellationToken);
                _logger.LogInformation("Completed seeder: {Seeder}", name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Seeder {Seeder} failed.", name);
                throw;
            }
        }

        _logger.LogInformation("Database seeding complete.");
    }
}
