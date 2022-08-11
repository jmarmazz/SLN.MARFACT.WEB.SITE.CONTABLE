namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class RetencionModel
    {
        public byte IndicadorAgenteRetencionoPercepcion { get; set; }
        public decimal MontoITBISRetenido { get; set; }
        public decimal? MontoISRRetenido { get; set; }
    }
}
