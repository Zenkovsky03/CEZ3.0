using CEZ3._0.Infrastructure.Persistence.Seeders;
using Microsoft.Extensions.DependencyInjection;

namespace CEZ3._0.Infrastructure.Extensions;

public static class SeederServiceCollectionExtensions
{
    /// <summary>
    /// Registers all ISeeder implementations and the SeederRunner.
    /// Call this from your Infrastructure DI registration method.
    /// </summary>
    public static IServiceCollection AddSeeders(this IServiceCollection services)
    {
        // Register every seeder as its interface
        services.AddScoped<ISeeder, UserSeeder>();
        services.AddScoped<ISeeder, CourseSeeder>();
        services.AddScoped<ISeeder, CourseEnrollmentSeeder>();
        services.AddScoped<ISeeder, CourseSectionSeeder>();
        services.AddScoped<ISeeder, SectionMaterialSeeder>();
        services.AddScoped<ISeeder, AssignmentSeeder>();
        services.AddScoped<ISeeder, StudentAssignmentAttemptSeeder>();
        services.AddScoped<ISeeder, GradeSeeder>();
        services.AddScoped<ISeeder, AnnouncementSeeder>();
        services.AddScoped<ISeeder, EventSeeder>();
        services.AddScoped<ISeeder, ConversationSeeder>();

        services.AddScoped<SeederRunner>();

        return services;
    }
}
