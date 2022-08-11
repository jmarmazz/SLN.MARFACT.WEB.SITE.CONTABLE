
using MARFACT.QUERY.DTOs;
using Microsoft.EntityFrameworkCore;
using System;

namespace MARFACT.QUERY.SQLSERVER.Models
{
    public sealed partial class QueryContext
    {
        private DbSet<LoginQueryDto> LoginQueryDto { get; set; }
        private DbSet<VentanaQueryDto> VentanaQueryDto { get; set; }
        private DbSet<VentanaLoginQueryDto> VentanaLoginQueryDto { get; set; }
        private DbSet<IdQueryDto> IdQueryDto { get; set; }
        

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        { 
            modelBuilder.Entity<LoginQueryDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<VentanaQueryDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<VentanaLoginQueryDto>().HasNoKey().ToView(null);
            modelBuilder.Entity<IdQueryDto>().HasNoKey().ToView(null);

        }
    }
}