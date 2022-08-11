namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class SubDescuentoModel 
    {
        public char TipoSubDescuento { get; set; }
        public decimal SubDescuentoPorcentaje { get; set; }
        public decimal MontoSubDescuento { get; set; }
    }
}
