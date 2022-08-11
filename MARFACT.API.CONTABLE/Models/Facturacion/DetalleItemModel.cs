using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class DetalleItemModel
    {
        public byte NumeroLinea { get; set; }
        public List<CodigoItemModel> CodigosItem { get; set; }
        public byte IndicadorFacturacion { get; set; }
        public RetencionModel Retencion { get; set; }
        public string NombreItem { get; set; }
        public byte IndicadorBienoServicio { get; set; }
        public string DescripcionItem { get; set; }
        public decimal CantidadItem { get; set; }
        public byte? UnidadMedida { get; set; }
        public decimal CantidadReferencia { get; set; }
        public byte UnidadReferencia { get; set; }
        public List<SubCantidadModel> SubCantidades { get; set; }
        public decimal GradosAlcohol { get; set; }
        public decimal PrecioUnitarioReferencia { get; set; }
        [XmlIgnore()] public bool FechaElaboracionSpecified { get; } = true;
        public DateTime? FechaElaboracion { get; set; }
        [XmlIgnore()] public bool FechaVencimientoItemSpecified { get; } = true;
        public DateTime? FechaVencimientoItem { get; set; }
        public MineriaModel Mineria { get; set; }
        public decimal PrecioUnitarioItem { get; set; }
        public decimal? DescuentoMonto { get; set; }
        public List<SubDescuentoModel> SubDescuentos { get; set; }
        public decimal? RecargoMonto { get; set; }
        public List<SubRecargoModel> SubRecargos { get; set; }
        public byte? ImpuestosAdicionales1 { get; set; }
        public byte? ImpuestosAdicionales2 { get; set; }
        public decimal? TasaImpuestoAdicional1 { get; set; }
        public decimal? TasaImpuestoAdicional2 { get; set; }
        public decimal MontoItem { get; set; }
        public byte ITBIS { get; set; }
        public string NombreIndicadorFacturacion { get; set; }
        
    }
}
