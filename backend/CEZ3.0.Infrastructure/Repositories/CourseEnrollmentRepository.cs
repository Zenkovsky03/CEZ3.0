using CEZ3._0.Domain.Entities;
using CEZ3._0.Domain.Repositories;
using CEZ3._0.Infrastructure.Presistance;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CEZ3._0.Infrastructure.Repositories;

public class CourseEnrollmentRepository : ICourseEnrollmentRepository
{
    private readonly CezDbContext _dbContext;
    public CourseEnrollmentRepository(CezDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task EnrolStudentAsync(CourseEnrollment courseEnrollment)
    {
        await _dbContext.CourseEnrollments.AddAsync(courseEnrollment);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<CourseEnrollment?> GetStudentEnrollmentAsync(ObjectId courseId, ObjectId userId)
    {
        return await _dbContext.CourseEnrollments
            .FirstOrDefaultAsync(ce => ce.CourseId == courseId && ce.UserId == userId && ce.IsActive == true);
    }

    public async Task<CourseEnrollment?> IsStudentEnrolledAsync(ObjectId courseId, ObjectId userId)
    {
        return await _dbContext.CourseEnrollments
            .FirstOrDefaultAsync(ce => ce.CourseId == courseId && ce.UserId == userId);
    }

    public async Task<bool> IfStudentEnrolledAsync(ObjectId courseId, ObjectId userId)
    {
        return await _dbContext.CourseEnrollments
            .AnyAsync(ce => ce.CourseId == courseId && ce.UserId == userId && ce.IsActive == true);
    }
    public async Task<List<ObjectId>> GetEnrolStudentIdAsync(List<ObjectId> courseIds)
    {
        var enrolledStudentIds = await _dbContext.CourseEnrollments
            .Where(ce => courseIds.Contains(ce.CourseId) && ce.IsActive == true)
            .Select(ce => ce.UserId)
            .Distinct()
            .ToListAsync();

        return enrolledStudentIds;
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<CourseEnrollment>> GetEnrolledCoursesAsync(ObjectId userId)
    {
        var enrolledCourses = await _dbContext.CourseEnrollments
            .Where(ce => ce.UserId == userId && ce.IsActive == true)
            .ToListAsync();

        return enrolledCourses;
    }

    public async Task<List<CourseEnrollment>> GetEnrolledStudentsAsync(ObjectId courseId)
    {
        var enrolledStudents = await _dbContext.CourseEnrollments
            .Where(ce => ce.CourseId == courseId && ce.IsActive == true)
            .ToListAsync();

        return enrolledStudents;
    }
}
