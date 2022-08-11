namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class ImpuestoAdicionalModel
    {
        public byte TipoImpuesto { get; set; }
        public decimal TasaImpuestoAdicional { get; set; }
        public decimal MontoImpuestoSelectivoConsumoEspecifico { get; set; }
        public decimal MontoImpuestoSelectivoConsumoAdvalorem { get; set; }
        public decimal OtrosImpuestosAdicionales { get; set; }
    }
}
