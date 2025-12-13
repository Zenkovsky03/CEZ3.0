using CEZ3._0.Domain.Entities;
using MongoDB.Bson;

namespace CEZ3._0.Domain.Repositories;

public interface ICourseEnrollmentRepository
{
    public Task EnrolStudentAsync(CourseEnrollment courseEnrollment);
    public Task<CourseEnrollment?> IsStudentEnrolledAsync(ObjectId courseId, ObjectId userId);
    public Task<CourseEnrollment?> GetStudentEnrollmentAsync(ObjectId courseId, ObjectId userId);
    public Task SaveChangesAsync();

}
