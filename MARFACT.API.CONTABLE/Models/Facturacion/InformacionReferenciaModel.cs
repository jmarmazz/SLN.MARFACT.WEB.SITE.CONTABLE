using System;
using System.Xml.Serialization;

namespace MARFACT.API.CONTABLE.Models.Facturacion
{
    public sealed class InformacionReferenciaModel
    {
        public string NCFModificado { get; set; }
        public string RNCOtroContribuyente { get; set; }
        [XmlIgnore()] public bool FechaNCFModificadoSpecified { get; } = true;
        private DateTime? _FechaNCFModificado { get; set; }
        public DateTime? FechaNCFModificado 
        {
            get
            {
                return _FechaNCFModificado;
            }
            set
            {
                if (value != null) _FechaNCFModificado = value?.Date;
            }
        }
        public byte CodigoModificacion { get; set; }
        public string RazonModificacion { get; set; }
    }
}
