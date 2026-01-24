using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CEZ3._0.Application.SectionMaterials.Command.EditSectionMaterial
{
    public class EditSectionMaterialCommand : IRequest
    {
        [JsonIgnore]
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
    }
}
