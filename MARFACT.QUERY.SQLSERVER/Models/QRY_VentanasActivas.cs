
using MARFACT.QUERY.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MARFACT.QUERY.SQLSERVER.Models
{
    public sealed partial class QueryContext
    {
        internal List<VentanaQueryDto> ConsultarVentanasActivas()
        {
            return VentanaQueryDto.FromSqlRaw("QRY_VentanasActivas").ToList();
        }
    }
}
