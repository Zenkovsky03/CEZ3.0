using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Entities
{
    public class StudentAssignmentAttempt
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public ObjectId AssignmentId { get; set; }
        public ObjectId StudentId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public List<StudentSelection> Selections { get; set; } = new();
        public int FinalScore { get; set; }
        public bool IsCompleted { get; set; }

        public string? SubmissionText { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
