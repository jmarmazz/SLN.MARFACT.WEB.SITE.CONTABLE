
using MARFACT.QUERY.DTOs;
using MARFACT.QUERY.Interfaces.QueryServices;
using MARFACT.QUERY.SQLSERVER.Models;
using MF.TOOLS;
using Microsoft.Extensions.DependencyInjection;

namespace MARFACT.QUERY.SQLSERVER.QueryServices
{
    public sealed class LoginQueryService : BaseQueryService, ILoginQueryService
    {
        public LoginQueryService(IServiceScopeFactory serviceScopeFactory) : base(serviceScopeFactory)
        {
        }

        public LoginQueryDto Login(string Usuario, string ClaveEncriptada, ref string mensaje)
        {
            try
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    using (var edocQueryContext = scope.ServiceProvider.GetRequiredService<QueryContext>())
                    {
                        return edocQueryContext.ConsultarLogin(Usuario, ClaveEncriptada);
                    };
                };
            }
            catch (Exception ex)
            {
                mensaje = string.Format("{0} => {1}", this.GetCaller(), ex.Message);
                return null;
            }
        }

        public List<VentanaLoginQueryDto> ConsultarVentana(short IdUsuario, ref string mensaje)
        {
            try
            {
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    using (var edocQueryContext = scope.ServiceProvider.GetRequiredService<QueryContext>())
                    {
                        return edocQueryContext.ConsultarVentanasXUsuarioLogin(IdUsuario);
                    };
                };
            }
            catch (Exception ex)
            {
                mensaje = string.Format("{0} => {1}", this.GetCaller(), ex.Message);
                return null;
            }
        } 

    }
}