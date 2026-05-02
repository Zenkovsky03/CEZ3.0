using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Entities.Calendar;
using CEZ3._0.Domain.Entities.Forum;
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
    public DbSet<SectionMaterial> SectionMaterials { get; set; }
    public DbSet<LessonAttachment> LessonAttachments { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<StudentAssignmentAttempt> Attempts { get; set; }
    public DbSet<Grade> Grades { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<UserAnnouncement> UserAnnouncements { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<UserEvent> UserEvents { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ChatMessage> Messages { get; set; }
    public DbSet<Domain.Entities.Forum.Thread> Threads { get; set; }
    public DbSet<ThreadReplay> ThreadReplays { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().ToCollection("Users");
        modelBuilder.Entity<Course>().ToCollection("Courses");
        modelBuilder.Entity<CourseEnrollment>().ToCollection("CourseEnrollments");
        modelBuilder.Entity<CourseSection>().ToCollection("CourseSections");
        modelBuilder.Entity<SectionMaterial>().ToCollection("SectionMaterials");
        modelBuilder.Entity<LessonAttachment>().ToCollection("LessonAttachments");
        modelBuilder.Entity<Assignment>().ToCollection("Assignments");
        modelBuilder.Entity<StudentAssignmentAttempt>().ToCollection("StudentAssignmentAttempts");
        modelBuilder.Entity<Grade>().ToCollection("Grades");
        modelBuilder.Entity<Announcement>().ToCollection("Announcements");
        modelBuilder.Entity<UserAnnouncement>().ToCollection("UserAnnouncements");
        modelBuilder.Entity<Event>().ToCollection("Events");
        modelBuilder.Entity<UserEvent>().ToCollection("UserEvents");
        modelBuilder.Entity<Conversation>().ToCollection("Conversations");
        modelBuilder.Entity<ChatMessage>().ToCollection("ChatMessages");
        modelBuilder.Entity<Domain.Entities.Forum.Thread>().ToCollection("Threads");
        modelBuilder.Entity<ThreadReplay>().ToCollection("ThreadReplays");
    }
}
