using MARFACT.APPLICATION;
using MARFACT.APPLICATION.Interfaces;
using MARFACT.APPLICATION.Parameters;
using MARFACT.WEB.SITE.CONTABLE.Parameters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace MARFACT.WEB.SITE.CONTABLE.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILoginAppService loginAppService;

        public LoginController(ILoginAppService loginAppService)
        {
            this.loginAppService = loginAppService;
        }

        // GET: LoginController
        public ActionResult Login()
        {
            return View();
        }

        // POST: LoginController/Login
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Login(IFormCollection collection)
        //{
        //    try
        //    {
        //        return RedirectToAction(nameof(Index));
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        [HttpPost]
        public ActionResult Login(string Usuario, string Clave)
        {
            try
            {
                var loginDto = loginAppService.Login(Usuario, Clave);
                if (loginDto == null) throw new Exception(AppParameters.ExcepcionGenerica);
                if (loginDto.IdUsuario > 0)
                {
                    if (loginDto.ForzarCambioClave)
                    {
                        HttpContext.Session.SetString("UsuarioLogin", JsonConvert.SerializeObject(loginDto));
                        return StatusCode(StatusCodes.Status200OK, "FirstLogin");
                    }
                    else
                    {
                        if (WebSiteParameters.WebLimiteConsulta == "") { WebSiteParameters.WebLimiteConsulta = "3[MM]"; }
                        WebSiteParameters.WebLimiteConsulta = WebSiteParameters.WebLimiteConsulta.ToUpper();
                        HttpContext.Session.SetString("UsuarioLogin", JsonConvert.SerializeObject(loginDto));
                        return StatusCode(StatusCodes.Status200OK, "Inicio");
                    }
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
