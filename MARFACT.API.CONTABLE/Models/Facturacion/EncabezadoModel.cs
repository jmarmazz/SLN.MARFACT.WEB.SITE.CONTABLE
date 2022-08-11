namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class EncabezadoModel
    {
        public IdDocModel IdDoc { get; set; }
        public EmisorModel Emisor { get; set; }
        public CompradorModel Comprador { get; set; }
        public InformacionAdicionalModel InformacionesAdicionales { get; set; }
        public TransporteModel Transporte { get; set; }
        public TotalModel Totales { get; set; }
    }
}
