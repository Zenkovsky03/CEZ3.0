using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Application.SectionMaterials.Command.DeleteSectionMaterial
{
    public class DeleteSectionMaterialCommand(string Id) : IRequest
    {
        public string Id { get; } = Id;
    }
}
