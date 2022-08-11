using System.Text.Json.Serialization;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class FormaPagoModel
    {
        [JsonPropertyName("FormaPago")]
        public byte Codigo { get; set; }
        public decimal MontoPago { get; set; }
        public string Nombre { get; set; }
    }
}
