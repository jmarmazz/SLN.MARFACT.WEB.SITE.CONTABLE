using System.Text.Json.Serialization;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class SubCantidadModel
    {
        [JsonPropertyName("SubCantidad")]
        public decimal Valor { get; set; }
        public byte CodigoSubCantidad { get; set; }
    }
}
