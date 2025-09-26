using Newtonsoft.Json;
using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using System.Data;
using System.Web.Mvc;
using System;
using Microsoft.Office.Interop.Excel;

namespace MeetingRecord.AppWeb.Controllers
{
    public class LocationMeetingController : Controller
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
        //21/8
        public JsonResult getAllLocationMeeting(int? areaId = null)
        {
            string jsonString;
            var persistence = new P_LocationMeeting();

            int areaIdValue = areaId ?? 0;
            DataSet dtsLocationMeeting = persistence.getAllLocationMeeting(areaIdValue);
            if (dtsLocationMeeting.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsLocationMeeting.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsLocationMeeting, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertLocationMeeting(E_LocationMeeting entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_LocationMeeting();
            string message = persistence.insertLocationMeeting(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult updateLocationMeeting(E_LocationMeeting entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_LocationMeeting();
            string message = persistence.updateLocationMeeting(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteLocationMeeting(string LocationCode)
        {
            var messageEntity = new E_Message();
            var persistence = new P_LocationMeeting();
            string message = persistence.deleteLocationMeeting(LocationCode);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        //16/08
        public JsonResult getAllLocationMeetingActive(int areaId)
        {
            var persistence = new P_LocationMeeting();
            var result = new { LocationMeeting = persistence.getAllLocationMeetingActive(areaId) };
            return Json(result, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5
        //16/08

    }
}