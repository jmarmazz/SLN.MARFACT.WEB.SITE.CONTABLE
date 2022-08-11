namespace MARFACT.QUERY.DTOs
{
    public sealed class VentanaQueryDto
    {
        public short IdVentana { get; set; }
        public string NombreAbreviado { get; set; }
        public short? IdPadre { get; set; }
    }
}
