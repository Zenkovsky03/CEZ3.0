using CEZ3._0.Domain.Entities;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface ICourseEnrollmentRepository
{
    Task EnrolStudentAsync(CourseEnrollment courseEnrollment);
    Task<CourseEnrollment?> IsStudentEnrolledAsync(ObjectId courseId, ObjectId userId);
    Task<CourseEnrollment?> GetStudentEnrollmentAsync(ObjectId courseId, ObjectId userId);
    Task<bool> IfStudentEnrolledAsync(ObjectId courseId, ObjectId userId);
    Task<List<ObjectId>> GetEnrolStudentIdAsync(List<ObjectId> courseIds);
    Task<List<CourseEnrollment>> GetEnrolledCoursesAsync(ObjectId userId);
    Task SaveChangesAsync();
}
