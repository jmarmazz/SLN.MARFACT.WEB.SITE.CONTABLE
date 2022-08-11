
using MARFACT.QUERY.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MARFACT.QUERY.SQLSERVER.Models
{
    public sealed partial class QueryContext
    {
        internal List<VentanaLoginQueryDto> ConsultarVentanasXUsuarioLogin(short IdUsuario)
        {
            return VentanaLoginQueryDto.FromSqlRaw("QRY_VentanasXUsuarioLogin @p0,@p1", IdUsuario).ToList();
        }
    }
}
