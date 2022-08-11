using MARFACT.DOMAIN.Constants;
using MF.TOOLS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class FacturaModel
    {
        public EncabezadoModel Encabezado { get; set; }
        public List<DetalleItemModel> DetallesItems { get; set; }
        public List<SubtotalModel> Subtotales { get; set; }
        public List<DescuentoRecargoModel> DescuentosRecargos { get; set; }
        public List<PaginacionModel> Paginaciones { get; set; }
        public InformacionReferenciaModel InformacionReferencia { get; set; } 
        public List<CampoAdicionalModel> CamposAdicionales { get; set; } 
        public string CorreoResponsable { get; set; }
        public string SecuencialERP { get; set; }
        public string CodigoTransaccionERP { get; set; }
        public string UsuarioTransaccionERP { get; set; }
        public string NombreIntegracion { get; set; }
		public byte? MarcaComercial { get; set; }
        public bool FacturadorManual { get; set; }
        public byte EstadoEmision { get; set; }
        public List<Archivo> Archivos { get; set; }
        public sealed class Archivo
        {
            public string Nombre { get; set; }
            [JsonPropertyName("Archivo")]
            public byte[] File { get; set; }
        } 
        public bool SecuenciaManual { get; set; }
        public int IdCliente { get; set; }
        public decimal MaximoMontoConsumo { set; get; } 
        public Dictionary<string, string> ListMonedas { get; set; }
        public Dictionary<string, string> ListFormasPago { get; set; }
        public Dictionary<string, string> ListProvincias { get; set; }
        public Dictionary<string, string> ListMunicipios { get; set; }
        public Dictionary<string, string> ListCientes { get; set; }
        public Dictionary<string, string> ListUnidadesMedida { get; set; }
        
    }
    public sealed class CampoAdicionalModel
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Dato { get; set; }
    }
}
