using Newtonsoft.Json;
using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using System.Data;
using System.Web.Mvc;
using System;

namespace MeetingRecord.AppWeb.Controllers
{
    public class ActionPlanCategoryController : Controller
    {
        public ActionResult Index()
        {
            if (Session.Count > 0)
            {
                int userRole = Convert.ToInt16(Session["UserRole"]);
                if (userRole == 1 || userRole == 2) //@AMENDEZ5
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        public JsonResult getAllActionPlanCategory()
        {
            string jsonString;
            var persistence = new P_ActionPlanCategory();
            DataSet dtsActionPlanCategory = persistence.getAllActionPlanCategory();
            if (dtsActionPlanCategory.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlanCategory.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsActionPlanCategory, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertActionPlanCategory(E_ActionPlanCategory entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlanCategory();
            string message = persistence.insertActionPlanCategory(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult updateActionPlanCategory(E_ActionPlanCategory entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlanCategory();
            string message = persistence.updateActionPlanCategory(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteActionPlanCategory(int actionPlanCategoryId)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlanCategory();
            string message = persistence.deleteActionPlanCategory(actionPlanCategoryId);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getAllActionPlanCategoryActive()
        {
            var persistence = new P_ActionPlanCategory();
            var result = new { ActionPlanCategory = persistence.getAllActionPlanCategoryActive() };
            return Json(result, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5
    }
}
