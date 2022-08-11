using Microsoft.EntityFrameworkCore;

namespace MARFACT.QUERY.SQLSERVER.Models
{
    public sealed partial class QueryContext : DbContext
    {
        public QueryContext()
            : base()
        {
        }

        public QueryContext(DbContextOptions<QueryContext> options)
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