using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class EmisorModel
    {
        public string RNCEmisor { get; set; }
        public string RazonSocialEmisor { get; set; }
        public string NombreComercial { get; set; }
        public string Sucursal { get; set; }
        public string DireccionEmisor { get; set; }
        public string Municipio { get; set; }
        public string Provincia { get; set; }
        public string TelefonosEmisor1 { get; set; }
        public string TelefonosEmisor2 { get; set; }
        public string TelefonosEmisor3 { get; set; }
        public string CorreoEmisor { get; set; }
        public string WebSite { get; set; }
        public string ActividadEconomica { get; set; }
        public string CodigoVendedor { get; set; }
        public string NumeroFacturaInterna { get; set; }
        public string NumeroPedidoInterno { get; set; }
        public string ZonaVenta { get; set; }
        public string RutaVenta { get; set; }
        public string InformacionAdicionalEmisor { get; set; }
        private DateTime _FechaEmision { get; set; }
        public DateTime FechaEmision
        {
            get
            {
                return _FechaEmision;
            }
            set
            {
                _FechaEmision = value.Date;
            }
        }
    }
}
