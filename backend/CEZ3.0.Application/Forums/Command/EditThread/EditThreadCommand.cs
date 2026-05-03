using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CEZ3._0.Application.Forums.Command.EditThread
{
    public class EditThreadCommand : IRequest
    {
        [JsonIgnore]
        public string ThreadId { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string Content { get; set; } = default!;
    }
}
