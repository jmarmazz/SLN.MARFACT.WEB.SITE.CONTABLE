
namespace MARFACT.DOMAIN.Constants
{
    public static class DomainConstants
    {
        public const string COMPONENTE_PORTAL = "MARFACT_Portal";

        public const string SEMILLA_ENCRIPTA = "Gs_Cliente2014";
        public const string SEMILLA_DOBLE_ENCRIPTA= "@CloudGS2014";
        public const string ENCRIPTA_KEY = "3m1l10";

        public const string PARAMETRO_RUTAIMAGENPDF = "RUTA_IMAGEN_PDF";
        public const string ERROREDOC_GENERAL = "E01";
        public const string ERRORSMTP_GENERAL = "M01";
        public const string ERRORSMTP_CORREOINVALIDO = "M02";

        public static string ObtenerDescripcionError(string CodigoError)
        {
            switch (CodigoError)
            {
                case ERROREDOC_GENERAL: return "Ha ocurrido una excepción, vuelva a intentar, en caso de que el error persista comuníquese con el administrador del sistema.";   
                case ERRORSMTP_GENERAL: return "Se ha producido una excepción durante el proceso. Comuníquese con el administrador del servidor de correo.";
                case ERRORSMTP_CORREOINVALIDO: return "Correo inválido:";

                default: throw new Exception("CodigoError no válido para ObtenerDescripcionError => " + CodigoError);
            }
        }
    }

    public enum TiposEnvioMail
    {
        SendGrid = 1,
        Smtp = 2,
        Amazon = 3
    }

    public enum EstadosEnvioMail
    {
        ErrorProceso = -4,
        DevueltaSMTP = -2,
        Devuelta = -1,
        PendienteEnvio = 0,
        Enviado = 1
    }  

    public enum SalidasArchivo
    {
        Base64 = 1,
        UrlInternet = 2
    }     
     
}
