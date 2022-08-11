namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class DescuentoRecargoModel 
    {
        public byte NumeroLinea { get; set; }
        public char TipoAjuste { get; set; }
        public bool IndicadorNorma1007 { get; set; }
        public string DescripcionDescuentooRecargo { get; set; }
        public char TipoValor { get; set; }
        public decimal ValorDescuentooRecargo { get; set; }
        public decimal MontoDescuentooRecargo { get; set; }
        public decimal? MontoDescuentooRecargoOtraMoneda { get; set; }
        public byte IndicadorFacturacionDescuentooRecargo { get; set; }
        public string NombreTipoAjuste { get; set; }
        public string NombreIndicadorFacturacionDescuentooRecargo { get; set; }
    }
}
