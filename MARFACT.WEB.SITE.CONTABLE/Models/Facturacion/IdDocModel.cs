using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class IdDocModel
    {
        public byte TipoeCF { get; set; }
        public string ENCF { get; set; }
        public DateTime FechaVencimientoSecuencia { get; set; }
        public bool? IndicadorNotaCredito { get; set; }
        public bool? IndicadorEnvioDiferido { get; set; }
        public bool? IndicadorMontoGravado { get; set; }
        public string TipoIngresos { get; set; }
        public byte TipoPago { get; set; }
        [XmlIgnore()] public bool FechaLimitePagoSpecified { get; } = true;
        public DateTime? FechaLimitePago { get; set; }
        public string TerminoPago { get; set; }
        public List<FormaPagoModel> FormasPago { get; set; }
        public string TipoCuentaPago { get; set; }
        public string NumeroCuentaPago { get; set; }
        public string BancoPago { get; set; }
        [XmlIgnore()] public bool FechaDesdeSpecified { get; } = true;
        public DateTime? FechaDesde { get; set; }
        [XmlIgnore()] public bool FechaHastaSpecified { get; } = true;
        public DateTime? FechaHasta { get; set; }
    }
}
