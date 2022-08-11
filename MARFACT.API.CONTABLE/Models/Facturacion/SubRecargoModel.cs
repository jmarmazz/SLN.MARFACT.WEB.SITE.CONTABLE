namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class SubRecargoModel
    {
        public char TipoSubRecargo { get; set; }
        public decimal SubRecargoPorcentaje { get; set; }
        public decimal MontoSubRecargo { get; set; }
    }
}
