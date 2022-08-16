
using MARFACT.APPLICATION.DTOs;
using MARFACT.APPLICATION.Extensions;
using MARFACT.APPLICATION.Interfaces;
using MARFACT.DOMAIN.Constants;
using MARFACT.QUERY.DTOs;
using MARFACT.QUERY.Interfaces.QueryServices;
using System;
using System.Collections.Generic;
using MF.TOOLS;
using Newtonsoft.Json;

namespace MARFACT.APPLICATION
{
    public sealed class LoginAppService : ILoginAppService
    {
        private readonly ILoginQueryService loginQueryService;

        public LoginAppService(ILoginQueryService loginQueryService)
        {
            this.loginQueryService = loginQueryService;
        } 

        public LoginAppResultDto Login(string Usuario, string Clave)
        {
            try
            {
                var ClaveEncriptada = MFCrypto.CifrarClave(Clave.Trim(), DomainConstants.ENCRIPTA_KEY);
                string mensaje = null;
                var result = loginQueryService.Login(Usuario, ClaveEncriptada, ref mensaje);
                if (result == null) throw new Exception(mensaje);
                var loginDto = result.MapToLoginAppDto();
                if (loginDto.IdUsuario > 0)
                {
                    var resultVentana = loginQueryService.ConsultarVentana(loginDto.IdUsuario, ref mensaje);
                    if (resultVentana == null) throw new Exception(mensaje);
                    loginDto.MenuPersonalizado = JsonConvert.SerializeObject(resultVentana); //GenerarMenuPersonalizado(resultVentana);
                    loginDto.VentanasActivasConcat = GenerarVentanaHabilitadasConcat(resultVentana);
                }
                return loginDto;
            }
            catch (Exception ex)
            {
                //logService.RegistrarLogAsync(null, this.GetCaller(), ex.Message);
                return null;
            }
        }

        private string GenerarMenuPersonalizado(List<VentanaLoginQueryDto> ventanasDto)
        {
            var ConcatMenu = "<li><a href='./Inicio'>Inicio</a></li>";
            if (ventanasDto != null && ventanasDto.Count > 0)
            {
                var rows = ventanasDto.FindAll(x => x.IdPadre == null);
                if (rows.Count == 0) { rows = ventanasDto.FindAll(x => x.IdPadre == 100); }
                if (rows != null)
                {
                    foreach (var ItemNivel1 in rows)
                    {
                        string CadNivel1Inicio = "<li class='dropdown'>";
                        CadNivel1Inicio += "<a class='dropdown-toggle' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" + ItemNivel1.NombreAbreviado + "</a>";
                        CadNivel1Inicio += "<ul class='dropdown-menu' aria-labelledby='navbarDropdown'>";
                        ConcatMenu += CadNivel1Inicio;
                        GenerarSubMenu(ventanasDto, ItemNivel1.IdVentana, ref ConcatMenu);
                        ConcatMenu += "</ul></li>";
                    }
                }
            }
            return ConcatMenu;
        }

        private void GenerarSubMenu(List<VentanaLoginQueryDto> ventanasDto, short IdNivelSuperior, ref string MenuConcat)
        {
            var rows = ventanasDto.FindAll(x => x.IdPadre == IdNivelSuperior);
            if (rows != null)
            {
                foreach (var ItemNivelSub in rows)
                {
                    if (ItemNivelSub.UrlPagina != null)
                    {
                        string MenuHref = "<li><a href='./" + ItemNivelSub.UrlPagina + "'>" + ItemNivelSub.NombreAbreviado + "</a></li>";
                        MenuConcat += MenuHref;
                    }
                    else
                    {
                        string MenuSubInicio = "<li class='dropdown'>";
                        MenuSubInicio += "<a class='dropdown-toggle' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" + ItemNivelSub.NombreAbreviado + "</a>";
                        MenuSubInicio += "<ul class='dropdown-menu' aria-labelledby='navbarDropdown'>";
                        MenuConcat += MenuSubInicio;
                        GenerarSubMenu(ventanasDto, ItemNivelSub.IdVentana, ref MenuConcat);
                        string MenuSubFin = "</ul></li>";
                        MenuConcat += MenuSubFin;
                    }
                }
            }
        }

        private string GenerarVentanaHabilitadasConcat(List<VentanaLoginQueryDto> ventanasDto)
        {
            string concat = string.Empty;
            if (ventanasDto != null && ventanasDto.Count > 0)
            {
                foreach (var i in ventanasDto)
                {
                    concat += i.IdVentana.ToString() + ";";
                }
            }
            return concat;
        }
    }
}
