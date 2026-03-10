using CEZ3._0.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEZ3._0.Infrastructure.Presistance.Configuration
{
    public class StudentAssignmentAttemptConfiguration : IEntityTypeConfiguration<StudentAssignmentAttempt>
    {
        public void Configure(EntityTypeBuilder<StudentAssignmentAttempt> builder)
        {
            builder.HasKey(e => e.Id);

            builder.OwnsMany(a => a.Selections, sBuilder =>
            {
            });
        }
    }
}
