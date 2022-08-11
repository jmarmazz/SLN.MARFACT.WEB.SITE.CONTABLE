
using MARFACT.DOMAIN.Constants;

namespace MARFACT.APPLICATION.Parameters
{
    public static class AppParameters
    {
        public static string NombreAplicacion { get; set; }
        public static string DirectorioRecovery { get; set; }
        public static string ExcepcionGenerica { get; } = DomainConstants.ObtenerDescripcionError(DomainConstants.ERROREDOC_GENERAL);
    }
}
