using System.Collections.Generic;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class TotalModel
    {
        public decimal? MontoGravadoTotal { get; set; }
        public decimal? MontoGravadoI1 { get; set; }
        public decimal? MontoGravadoI2 { get; set; }
        public decimal? MontoGravadoI3 { get; set; }
        public decimal? MontoExento { get; set; }
        public byte? ITBIS1 { get; set; }
        public byte? ITBIS2 { get; set; }
        public byte? ITBIS3 { get; set; }
        public decimal? TotalITBIS { get; set; }
        public decimal? TotalITBIS1 { get; set; }
        public decimal? TotalITBIS2 { get; set; }
        public decimal? TotalITBIS3 { get; set; }
        public decimal MontoImpuestoAdicional { get; set; }
        public List<ImpuestoAdicionalModel> ImpuestosAdicionales { get; set; }
        public decimal MontoTotal { get; set; }
        public decimal? MontoNoFacturable { get; set; }
        public decimal? MontoPeriodo { get; set; }
        public decimal? SaldoAnterior { get; set; }
        public decimal MontoAvancePago { get; set; }
        public decimal? ValorPagar { get; set; }
        public decimal TotalITBISRetenido { get; set; }
        public decimal TotalISRRetencion { get; set; }
        public decimal TotalITBISPercepcion { get; set; }
        public decimal TotalISRPercepcion { get; set; }
    }
}
