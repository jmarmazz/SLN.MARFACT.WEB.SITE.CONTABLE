using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MARFACT.INFRA.REPOSITORY.SQLSERVER.Models
{
    public sealed partial class CmdContext : DbContext
    {
        public CmdContext()
            : base()
        {
        }

        public CmdContext(DbContextOptions<CmdContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("data source=localhost\\SQLEXPRESS;initial catalog=DB_MARFACT;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
