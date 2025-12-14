using MediatR;
using MongoDB.Bson;

namespace CEZ3._0.Application.Courses.Query.IsUserEnroll;

public class IsUserEnrollQuery : IRequest<bool>
{
    public ObjectId CourseId { get; set; }

    public IsUserEnrollQuery(ObjectId courseId)
    {
        CourseId = courseId;
    }
}
