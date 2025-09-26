using Newtonsoft.Json;
using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using System.Data;
using System.Web.Mvc;
using System;

namespace MeetingRecord.AppWeb.Controllers
{
    public class TypeMeetingController : Controller
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
        public JsonResult getAllTypeMeeting(int? areaId = null, int? cellId = null)
        {
            string jsonString;
            var persistence = new P_TypeMeeting();

            int areaIdValue = areaId ?? 0;
            int cellIdValue = cellId ?? 0;

            DataSet dtsTypeMeeting = persistence.getAllTypeMeeting(areaIdValue, cellIdValue);

            if (dtsTypeMeeting.Tables.Count > 0 && dtsTypeMeeting.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsTypeMeeting.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsTypeMeeting, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }


        /*public JsonResult getAllTypeMeeting()
        {
            string jsonString;
            var persistence = new P_TypeMeeting();
            DataSet dtsTypeMeeting = persistence.getAllTypeMeeting();
            if (dtsTypeMeeting.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsTypeMeeting.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsTypeMeeting, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }*/

        public JsonResult insertTypeMeeting(E_TypeMeeting entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_TypeMeeting();
            string message = persistence.insertTypeMeeting(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult updateTypeMeeting(E_TypeMeeting entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_TypeMeeting();
            string message = persistence.updateTypeMeeting(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteTypeMeeting(string typeMeetingCode)
        {
            var messageEntity = new E_Message();
            var persistence = new P_TypeMeeting();
            string message = persistence.deleteTypeMeeting(typeMeetingCode);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getAllTypeMeetingActive(int areaId)
        {
            var persistence = new P_TypeMeeting();
            var result = new { TypeMeeting = persistence.getAllTypeMeetingActive(areaId) };
            return Json(result, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5

        //21/8
        public JsonResult getTypeMeetingByArea(int areaId, int? cellId)
        {
            var persistence = new P_TypeMeeting();
            var result = new { TypeMeeting = persistence.getTypeMeetingByArea(areaId, cellId) };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //21/8
    }
}