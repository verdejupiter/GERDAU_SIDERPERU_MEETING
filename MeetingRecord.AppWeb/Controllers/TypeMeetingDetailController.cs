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
    public class TypeMeetingDetailController : Controller
    {
        public JsonResult getTypeMeetingDetailByCode(string typeMeetingCode)
        {
            string jsonString;
            var persistence = new P_TypeMeetingDetail();
            DataSet dtsTypeMeeting = persistence.getTypeMeetingDetailByCode(typeMeetingCode);
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
        }

        public JsonResult insertTypeMeetingDetail(string typeMeetingCode, List<E_User> userEntityList)
        {
            var messageEntity = new E_Message();
            var persistence = new P_TypeMeetingDetail();
            string message = "";
            foreach(E_User entity in userEntityList) {
                message = persistence.insertTypeMeetingDetail(typeMeetingCode, entity.UserId);
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteTypeMeetingDetail(string typeMeetingCode)
        {
            var messageEntity = new E_Message();
            var persistence = new P_TypeMeetingDetail();
            string message = persistence.deleteTypeMeetingDetail(typeMeetingCode);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}