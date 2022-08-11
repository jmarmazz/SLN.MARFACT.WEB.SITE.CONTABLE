using System.ComponentModel;

namespace MARFACT.APPLICATION.Constants
{
    public static class AppConstants
    {
        public const string Version = "1.0";
    }

    public enum TiposDocReportesEDOC
    {
        [Description("Tipo Documento (Todos)")]
        Todos = 0,
        Factura = 1,
        [Description("Nota Crédito")]
        NotaCredito = 3,
        [Description("Nota Débito")]
        NotaDebito = 4,
        [Description("Factura Compra")]
        FacturaCompra = 6,
        [Description("Pago Exterior")]
        Pago = 7
    }

    public enum TipoCopiaCorreoEdoc
    {
        [Description("CC: COPIA NORMAL")]
        CopiaNormal = 1,
        [Description("CCO: COPIA OCULTA")]
        CopiaOculta = 2,
        [Description("PARA: COMO DESTINATARIO")]
        ParaComoDestinatario = 3
    }

    public enum TopsConsultaMant
    {
        [Description("Todos, omitir coincidencias")]
        Todos = 0,
        [Description("50 Registros")]
        Registros50 = 50,
        [Description("100 Registros")]
        Registros100 = 100,
        [Description("300 Registros")]
        Registros300 = 300,
        [Description("500 Registros")]
        Registros500 = 500,
        [Description("1000 Registros")]
        Registros1000 = 1000,
    }

    public enum TablasMaestras
    {
        Roles = 1,
        Sucursales = 2,
        Compañias = 3,
        TipoServicioMail = 4,
        ServiciosEdoc = 5,
        TiposDocumento = 6,
        UsuariosGS = 7,
        RolesGS = 8,
        Partners = 9,
    }   

    public enum OperacionCRUD
    {
        Insertar = 1,
        Actualizar = 2,
        Eliminar = 3
    }
}
