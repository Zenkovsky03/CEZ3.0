namespace CEZ3._0.Infrastructure.Persistence.Seeders;

public interface ISeeder
{
    int Order { get; }
    Task SeedAsync(CancellationToken cancellationToken = default);
}
