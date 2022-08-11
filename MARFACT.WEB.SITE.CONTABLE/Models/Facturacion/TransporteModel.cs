namespace MARFACT.WEB.SITE.CONTABLE.Models.Facturacion
{
    public sealed class TransporteModel
    {
        public byte? ViaTransporte { get; set; }
        public string PaisOrigen { get; set; }
        public string DireccionDestino { get; set; }
        public string PaisDestino { get; set; }
        public string RNCIdentificacionCompaniaTransportista { get; set; }
        public string NombreCompaniaTransportista { get; set; }
        public string NumeroViaje { get; set; }
        public string Conductor { get; set; }
        public string DocumentoTransporte { get; set; }
        public string Ficha { get; set; }
        public string Placa { get; set; }
        public string RutaTransporte { get; set; }
        public string ZonaTransporte { get; set; }
        public string NumeroAlbaran { get; set; }
    }
}
