using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MeetingRecord.AppWeb.Controllers
{
    public class ReportController : Controller
    {
        public ActionResult Index()
        {
            if (Session.Count > 0)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        public JsonResult GetReportMeetingUserAssistanceByArgs(string typeMeetingCode, int areaId, int cellId, int year, int month)
        {
            string jsonString;
            var persistence = new P_Report();
            DataSet dtsMeeting = persistence.GetReportMeetingUserAssistanceByArgs(typeMeetingCode, areaId, cellId, year, month);
            if (dtsMeeting.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsMeeting.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsMeeting, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReportDetailMeetingUserAssistanceByArgs(string typeMeetingCode, int areaId, int cellId, int year, int month)
        {
            string jsonString;
            var persistence = new P_Report();
            DataSet dtsMeeting = persistence.GetReportDetailMeetingUserAssistanceByArgs(typeMeetingCode, areaId, cellId, year, month);
            if (dtsMeeting.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsMeeting.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsMeeting, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }
    }
}