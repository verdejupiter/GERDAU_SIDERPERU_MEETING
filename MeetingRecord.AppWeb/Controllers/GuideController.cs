using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace MeetingRecord.AppWeb.Controllers
{
    public class GuideController : Controller
    {
        public JsonResult insertGuide(List<E_Guide> entityList)
        {
            var messageEntity = new E_Message();
            var persistence = new P_Guide();
            string message = "";

            if (entityList != null)
            {
                foreach (E_Guide entity in entityList)
                {
                    message = persistence.insertGuide(entity);
                    Thread.Sleep(500);
                }
            }
            else
            {
                message = "Error: entityList es null";
            }

            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

    }
}