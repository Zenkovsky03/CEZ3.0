using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Domain.Entities
{
    public class QuizQuestion
    {
        public ObjectId Id { get; set; } 
        public string Text { get; set; } = default!;
        public string Type { get; set; } = default!; // "SingleChoice", "MultipleChoice"
        public int Points { get; set; }
        public List<QuizAnswer> Answers { get; set; } = new();
    }
}
