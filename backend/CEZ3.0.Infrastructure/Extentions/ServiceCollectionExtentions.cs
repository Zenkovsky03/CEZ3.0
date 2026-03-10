using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using CEZ3._0.Infrastructure.Repositories;
using CEZ3._0.Infrastructure.Seeder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CEZ3._0.Infrastructure.Extentions;

public static class ServiceCollectionExtentions
{
    public static void AddInfrastructure(this IServiceCollection services)
    {
        services.AddDbContext<CezDbContext>(options =>
            options.UseMongoDB(Environment.GetEnvironmentVariable("MongoDB_URL")!,
            Environment.GetEnvironmentVariable("MongoDB_DbName")!));

        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICourseEnrollmentRepository, CourseEnrollmentRepository>();
        services.AddScoped<ICourseSectionRepository, CourseSectionRepository>();
        services.AddScoped<ISectionMaterialRepository, SectionMaterialRepository>();
        services.AddScoped<ILessonAttachmentRepository, LessonAttachmentRepository>();
        services.AddScoped<IAssignmentRepository, AssignmentRepository>();
        services.AddScoped<IAttemptRepository, AttemptRepository>();
        services.AddScoped<IGradeRepository, GradeRepository>();
        services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
        services.AddScoped<IEventRepository, EventRepository>();

        services.AddScoped<ICez3_0Seeder, Cez3_0Seeder>();
    }
}
