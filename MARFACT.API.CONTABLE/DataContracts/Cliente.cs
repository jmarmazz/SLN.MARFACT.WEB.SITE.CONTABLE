
using System.ComponentModel.DataAnnotations;

namespace MARFACT.API.DataContracts
{
    public sealed class Cliente 
    {
        public int IdCliente { get; set; }
        [Required]
        public string Identificacion { get; set; }
        [Required]
        public string Nombres { get; set; }
        [Required]
        public string Apellidos { get; set; }
        [Required]
        public byte Edad { get; set; }
        [Required]
        public DateTime FechaNacimiento { get; set; }
        [Required]
        public string Direccion { get; set; }
        [Required]
        public string Telefono { get; set; }
        [Required]
        public string EstadoCivil { get; set; }
        public string IdentificacionConyugue { get; set; }
        public string NombreConyugue { get; set; }
        [Required]
        public bool SujetoCredito { get; set; }
    } 

}
