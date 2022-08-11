using MARFACT.API.CONTABLE.Models.Facturacion;
using MF.TOOLS;
using Microsoft.AspNetCore.Mvc;

namespace MARFACT.API.CONTABLE.Controllers
{
    public class NotaCreditoController : Controller
    {
        public IActionResult Index()
        {
            FacturaModel model = new FacturaModel();
            this.CargarCombos(ref model);

            var secuencia = 10;//secuencialAppService.ConsultarSecuencialDocumentoXCompania(loginDto.RncCiaNube, (byte)TiposDocumentoDGII.FacturaCreditoFiscal, ref mensaje);
            model.Encabezado = new EncabezadoModel() { IdDoc = new IdDocModel() { ENCF = MFConversions.StringToStringZeroOnLeft(secuencia.ToString(), 10) } };
            model.DetallesItems = new List<DetalleItemModel>();
            model.Encabezado.Emisor = new EmisorModel() { FechaEmision = DateTime.Now.Date };

            return View(model);
        }

        public virtual void CargarCombos(ref FacturaModel model)
        {
            model.ListMonedas = new Dictionary<string, string>();
            model.ListFormasPago = new Dictionary<string, string>();
            model.ListProvincias = new Dictionary<string, string>();
            model.ListMunicipios = new Dictionary<string, string>();
            //model.ListCientes = listarMaestraAppService.ConsultarListaDGII(TablasMaestrasDGII.Clientes, RncCiaNube, UsuarioLogin);
            ViewBag.ListUnidadesMedida = new Dictionary<string, string>();
        }
    }
}
