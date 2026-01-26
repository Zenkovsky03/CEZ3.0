using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.SectionMaterials.Command.CreateSectionMaterial
{
    public class CreateSectionMaterialCommand : IRequest<string>
    {
        [Required]
        public string Title { get; set; } = default!;
        public string Content { get; set; } = default!;
        public string MaterialType { get; set; } = default!;
        [Required]
        public string SectionId { get; set; } = default!;
    }
}
