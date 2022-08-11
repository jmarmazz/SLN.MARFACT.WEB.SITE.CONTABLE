
using MARFACT.QUERY.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MARFACT.QUERY.SQLSERVER.Models
{
    public sealed partial class QueryContext
    {
        internal List<IdQueryDto> ConsultarRolVentanas(short IdRol)
        {
            return IdQueryDto.FromSqlRaw("QRY_VentanasXIdRol @p0", IdRol).ToList();
        }
    }
}
