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
    public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
    {
        public void Configure(EntityTypeBuilder<Assignment> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Title).IsRequired().HasMaxLength(200);
            builder.Property(e => e.Description).HasMaxLength(2000);

            builder.OwnsMany(a => a.Questions, qBuilder =>
            {
                qBuilder.Property(q => q.Text).IsRequired().HasMaxLength(500);

                qBuilder.OwnsMany(q => q.Answers, aBuilder =>
                {
                    aBuilder.Property(a => a.Text).IsRequired().HasMaxLength(300);
                });
            });
        }
    }
}
