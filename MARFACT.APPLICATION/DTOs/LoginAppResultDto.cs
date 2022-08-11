namespace MARFACT.APPLICATION.DTOs
{
    public sealed class LoginAppResultDto
    {
        public short IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string ClaveEncriptada { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; } 
        public bool ForzarCambioClave { get; set; }
        public string IPLogin { get; set; }
        public string MenuPersonalizado { get; set; }
        public string VentanasActivasConcat { get; set; }
        public bool Bloqueado { get; set; }
    }
}
