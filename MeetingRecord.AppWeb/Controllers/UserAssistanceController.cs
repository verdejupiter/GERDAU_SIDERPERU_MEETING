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
    public class UserAssistanceController : Controller
    {
        public JsonResult insertUserAssistance(List<E_UserAssistance> entityList)
        {
            var messageEntity = new E_Message();
            var persistence = new P_UserAssistance();
            string message = "";
            foreach (E_UserAssistance entity in entityList)
            {
                message = persistence.insertUserAssistance(entity);
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}