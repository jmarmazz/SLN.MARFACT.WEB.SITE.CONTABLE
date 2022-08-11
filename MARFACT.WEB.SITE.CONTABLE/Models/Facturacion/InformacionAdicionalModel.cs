using System;
using System.Xml.Serialization;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class InformacionAdicionalModel
    {
        public DateTime? FechaEmbarque { get; set; }
        public string NumeroEmbarque { get; set; }
        public string NumeroContenedor { get; set; }
        public string NumeroReferencia { get; set; }
        public string NombrePuertoEmbarque { get; set; }
        public string CondicionesEntrega { get; set; }
        public decimal? TotalFob { get; set; }
        public decimal? Seguro { get; set; }
        public decimal? Flete { get; set; }
        public decimal? OtrosGastos { get; set; }
        public decimal? TotalCif { get; set; }
        public string RegimenAduanero { get; set; }
        public string NombrePuertoSalida { get; set; }
        public string NombrePuertoDesembarque { get; set; }
        public decimal? PesoBruto { get; set; }
        public decimal? PesoNeto { get; set; }
        public byte? UnidadPesoBruto { get; set; }
        public byte? UnidadPesoNeto { get; set; }
        public decimal? CantidadBulto { get; set; }
        public byte? UnidadBulto { get; set; }
        public decimal? VolumenBulto { get; set; }
        public byte? UnidadVolumen { get; set; }
    }
}
