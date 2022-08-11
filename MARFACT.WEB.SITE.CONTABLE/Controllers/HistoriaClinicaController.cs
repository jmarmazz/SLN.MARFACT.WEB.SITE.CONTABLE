using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MARFACT.WEB.SITE.CONTABLE.Controllers
{
    public class HistoriaClinicaController : Controller
    {
        // GET: HistoriaClinicaController
        public ActionResult Registro()
        {
            return View();
        }

        // GET: HistoriaClinicaController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: HistoriaClinicaController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: HistoriaClinicaController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: HistoriaClinicaController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: HistoriaClinicaController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: HistoriaClinicaController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: HistoriaClinicaController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
