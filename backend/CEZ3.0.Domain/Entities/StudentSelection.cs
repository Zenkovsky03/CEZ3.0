using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Entities
{
    public class StudentSelection
    {
        public ObjectId QuestionId { get; set; }
        public List<ObjectId> SelectedAnswerIds { get; set; } = new();
    }
}
