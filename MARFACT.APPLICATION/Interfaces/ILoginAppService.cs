
using MARFACT.APPLICATION.DTOs;

namespace MARFACT.APPLICATION.Interfaces
{
    public interface ILoginAppService
    {
        LoginAppResultDto Login(string Usuario, string Clave);
        
    }
}
