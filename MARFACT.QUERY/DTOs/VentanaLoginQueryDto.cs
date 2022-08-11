namespace MARFACT.QUERY.DTOs
{
    public sealed class VentanaLoginQueryDto
    {
        public short IdVentana { get; set; }
        public short? IdPadre { get; set; }
        public string Pagina { get; set; }
        public string NombreAbreviado { get; set; }
    }
}
