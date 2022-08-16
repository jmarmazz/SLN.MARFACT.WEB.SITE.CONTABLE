
using System.ComponentModel.DataAnnotations;

namespace MARFACT.API.DataContracts
{
    public sealed class Login
    {
        [Required]
        public string Usuario { get; set; }
        [Required]
        public string Clave { get; set; }
    } 

}
