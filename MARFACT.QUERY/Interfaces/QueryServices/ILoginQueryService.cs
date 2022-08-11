
using MARFACT.QUERY.DTOs;

namespace MARFACT.QUERY.Interfaces.QueryServices
{
    public interface ILoginQueryService
    {
        LoginQueryDto Login(string Usuario, string ClaveEncriptada, ref string mensaje);
        List<VentanaLoginQueryDto> ConsultarVentana(short IdUsuario, ref string mensaje);
    }
}
