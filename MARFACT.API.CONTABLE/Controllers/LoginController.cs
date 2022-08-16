using MARFACT.API.DataContracts;
using MARFACT.APPLICATION;
using MARFACT.APPLICATION.Interfaces;
using MARFACT.APPLICATION.Parameters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace MARFACT.API.CONTABLE.Controllers
{
    [ApiController]
    [Route("/Login")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginAppService loginAppService;

        public LoginController(ILoginAppService loginAppService)
        {
            this.loginAppService = loginAppService;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(Login login)
        {
            try
            {
                var loginDto = loginAppService.Login(login.Usuario, login.Clave);
                if (loginDto == null) throw new Exception(AppParameters.ExcepcionGenerica);
                if (loginDto.IdUsuario > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, JsonConvert.SerializeObject(loginDto));
                }
                else
                {
                    if (loginDto.Bloqueado)
                        throw new Exception("¡Usuario bloqueado!, Ha excedido el máximo de intentos, ingrese a la opción: ¿Olvidaste tu contraseña? Para el desbloqueo del usuario.");
                    else
                        throw new Exception("No tiene acceso para este aplicativo.<br />Usuario o clave incorrecta.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message.ToString());
            }
        }

    }
}
