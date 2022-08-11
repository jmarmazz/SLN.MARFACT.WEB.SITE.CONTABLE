using System.Collections.Generic;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class PaginacionModel
    {
        public byte PaginaNo { get; set; }
        public byte NoLineaDesde { get; set; }
        public byte NoLineaHasta { get; set; }
        public decimal? SubtotalMontoGravadoPagina { get; set; }
        public decimal? SubtotalMontoGravado1Pagina { get; set; }
        public decimal? SubtotalMontoGravado2Pagina { get; set; }
        public decimal? SubtotalMontoGravado3Pagina { get; set; }
        public decimal? SubtotalExentoPagina { get; set; }
        public decimal? SubtotalItbisPagina { get; set; }
        public decimal? SubtotalItbis1Pagina { get; set; }
        public decimal? SubtotalItbis2Pagina { get; set; }
        public decimal? SubtotalItbis3Pagina { get; set; }
        public decimal? SubtotalImpuestoAdicionalPagina { get; set; }
        public List<SubtotalImpuestoAdicionalModel> SubtotalesImpuestosAdicionales { get; set; }
        public decimal MontoSubtotalPagina { get; set; }
        public decimal? SubtotalMontoNoFacturablePagina { get; set; }
    }
}
