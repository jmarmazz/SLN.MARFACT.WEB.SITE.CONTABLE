namespace MARFACT.QUERY.DTOs
{
    public sealed class LoginQueryDto
    {
        public short IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string Clave { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; } 
        public bool EsAdministrador { get; set; }
        public bool ForzarCambioClave { get; set; }
        public bool Bloqueado { get; set; }
    }
}
