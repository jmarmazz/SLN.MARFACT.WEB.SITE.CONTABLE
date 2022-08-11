namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class MineriaModel
    {
        public decimal PesoNetoKilogramo { get; set; }
        public decimal PesoNetoMineria { get; set; }
        public byte TipoAfiliacion { get; set; }
        public byte Liquidación { get; set; }
    }
}
