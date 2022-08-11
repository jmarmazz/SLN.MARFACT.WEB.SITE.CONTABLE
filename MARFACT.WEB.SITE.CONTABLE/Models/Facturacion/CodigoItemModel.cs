using System.Text.Json.Serialization;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class CodigoItemModel
    {
        public string TipoCodigo { get; set; }
        [JsonPropertyName("CodigoItem")]
        public string Codigo { get; set; }
    }
}
