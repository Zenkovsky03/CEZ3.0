using CEZ3._0.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;

namespace CEZ3._0.Infrastructure.Presistance;

public class CezDbContext : DbContext
{
    public CezDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseEnrollment> CourseEnrollments { get; set; }
    public DbSet<CourseSection> CourseSections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().ToCollection("Users");
        modelBuilder.Entity<Course>().ToCollection("Courses");
        modelBuilder.Entity<CourseEnrollment>().ToCollection("CourseEnrollments");
        modelBuilder.Entity<CourseSection>().ToCollection("CourseSections");
    }
}
