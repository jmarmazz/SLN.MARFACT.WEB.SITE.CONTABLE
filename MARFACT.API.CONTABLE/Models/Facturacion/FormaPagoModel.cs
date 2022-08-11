using System.Text.Json.Serialization;

namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class FormaPagoModel
    {
        [JsonPropertyName("FormaPago")]
        public byte Codigo { get; set; }
        public decimal MontoPago { get; set; }
        public string Nombre { get; set; }
    }
}
