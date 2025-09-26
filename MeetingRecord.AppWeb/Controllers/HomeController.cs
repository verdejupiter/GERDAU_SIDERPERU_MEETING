using MeetingRecord.AppWeb.Models.Model;
using Microsoft.AspNetCore.Cors;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace MeetingRecord.AppWeb.Controllers
{
    [EnableCors("AllowAll")]
    public class HomeController : Controller
    {        
        public ActionResult Index()
        {
            if (Session.Count > 0)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "MeetingRegister");
            }
        }

        public ActionResult AccessWeb()
        {
            return View();
        }

        public ActionResult Login()
        {
            if (Session.Count > 0)
            {
                return RedirectToAction("Index", "MeetingRegister");
            }
            else
            {
                return View();
            }
        }

        public ActionResult Logout()
        {
            Session.Abandon();
            return RedirectToAction("Login", "MeetingRegister");
        }

        public ActionResult SideNavBar()
        {
            int userRole = int.Parse(Session["UserRole"].ToString());
            //int userRole = int.Parse(Session["ME_UserRole"].ToString()); //ANTES 
            string baseUrl = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/');
            string appPath = Request.ApplicationPath != "/" ? Request.ApplicationPath + "/" : "/";
            string urlPath = Request.Url.AbsolutePath.Replace(appPath, "");

            var model = new List<M_Menu>
            {                    
                new M_Menu()  //@AMENDEZ5
                {
                    MenuId      = "menu-action-plan",
                    MenuName    = "Planes de Acción",
                    MenuIcon    = "check_box",
                    MenuUrl     = "ActionPlan"
                },
                new M_Menu() //@AMENDEZ5
                {
                     MenuId      = "menu-meeting-register",
                     MenuName    = "Nueva Acta",
                     MenuIcon    = "add_circle",
                     MenuUrl     = "MeetingRegister"
                },
                new M_Menu() //@AMENDEZ5
                {
                     MenuId      = "menu-meeting-list",
                     MenuName    = "Actas de Reunión",
                     MenuIcon    = "assignment",
                     MenuUrl     = "MeetingList"
                },                
                new M_Menu() //@AMENDEZ5
                {
                     MenuId      = "report",
                     MenuName    = "Indicadores",
                     MenuIcon    = "insert_chart",
                     MenuUrl     = "Report"
                },
                // Menu Administrador //@AMENDEZ5
                (userRole == 1 || userRole == 2) ?
                new M_Menu()
                {
                     MenuId      = "menu-type-meeting",
                     MenuName    = "Tipo de reunión",
                     MenuIcon    = "add",
                     MenuUrl     = "TypeMeeting"
                }: null,
                (userRole == 1 || userRole == 2) ? //@AMENDEZ5
                new M_Menu()
                {
                     MenuId      = "menu-users",
                     MenuName    = "Asignación de Roles",
                     MenuIcon    = "person",
                     MenuUrl     = "User"
                 }: null,
                (userRole == 1 || userRole == 2) ? //@AMENDEZ5
                new M_Menu()
                {
                     MenuId      = "menu-lugar",
                     MenuName    = "Lugares",
                     MenuIcon    = "place",
                     MenuUrl     = "LocationMeeting"
                }: null,
                (userRole == 1 || userRole == 2) ? //@AMENDEZ5
                new M_Menu()
                {
                     MenuId      = "menu-category",
                     MenuName    = "Categorías",
                     MenuIcon    = "book",
                     MenuUrl     = "ActionPlanCategory"
                }: null,
                new M_Menu() //@AMENDEZ5
                {
                     MenuId      = "profile-logout",
                     MenuName    = "Cerrar Sesión",
                     MenuIcon    = "keyboard_tab",
                     MenuUrl     = "Logout"
                }
                /*new M_Menu()
                {
                    MenuId      = "menu-home",
                    MenuName    = "Mis Planes de Acción",
                    MenuIcon    = "home",
                    MenuUrl     = "Home"
                },
                new M_Menu()
                {
                    MenuId      = "menu-meeting",
                    MenuName    = "Actas",
                    MenuClass   = "collapsible-header waves-effect waves-cyan",
                    MenuIcon    = "people",
                    MenuUrl     = "javascript:void(0);",
                    MenuChild   = new List<M_Menu>
                    {
                        new M_Menu()
                        {
                            MenuId      = "menu-meeting-list",
                            MenuName    = "Lista de actas",
                            MenuIcon    = "check_box",
                            MenuUrl     = "MeetingList"
                        }
                    }
                },*/ //ANTES
                /*new M_Menu() {
                    MenuId      = "menu-maintenance",
                    MenuName    = "Mantenimiento",
                    MenuClass   = "collapsible-header waves-effect waves-cyan",
                    MenuIcon    = "settings",
                    MenuUrl     = "javascript:void(0);",
                    MenuChild   = new List<M_Menu>
                    {
                        new M_Menu()
                        {
                            MenuId      = "menu-type-meeting",
                            MenuName    = "Tipo de reunión",
                            MenuIcon    = "check_box",
                            MenuUrl     = "TypeMeeting"
                        },
                        new M_Menu()
                        {
                            MenuId      = "menu-users",
                            MenuName    = "Usuarios",
                            MenuIcon    = "person",
                            MenuUrl     = "User"
                        }
                    }
                }: null,*/ //ANTES
            };            
            foreach (var i in model)
            {
                if(i != null)
                {
                    string menuUrl = i.MenuUrl;
                    if (menuUrl == urlPath)
                    {
                        i.MenuActive = "active";
                        break;
                    }
                    if (i.MenuChild != null)
                    {
                        foreach (var ic in i.MenuChild)
                        {
                            string menuUrlChild = ic.MenuUrl;
                            if (menuUrlChild == urlPath)
                            {
                                i.MenuActive = "active";
                                ic.MenuActive = "submenu-active";
                                break;
                            }
                        }
                    }
                }                
            }
            return PartialView("~/Views/Home/_SideNavBar.cshtml", model);
        }

        [HttpPost]
        [ValidateInput(false)]
        public PartialViewResult Modal(M_Modal model)
        {
            return PartialView("~/Views/Home/_Modal.cshtml", model);
        }
    }
}