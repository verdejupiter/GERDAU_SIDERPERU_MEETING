using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading;
using System.Web.Helpers;
using System.Web.Mvc;

namespace MeetingRecord.AppWeb.Controllers
{
    public class MeetingDevelopmentController : Controller
    {
        public JsonResult insertMeetingDev(List<E_MeetingDevelopment> entityList)
        {
            var messageEntity = new E_Message();
            var persistence = new P_MeetingDevelopment();
            string message = "";
            //@AMENDEZ5
            if (entityList != null && entityList.Count > 0)
            {
                foreach (E_MeetingDevelopment entity in entityList)
                {
                    message = persistence.insertMeetingDev(entity);
                    Thread.Sleep(500);
                }
            }
            //@AMENDEZ5
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertMeetingDevWithImage(List<E_MeetingDevelopment> entityList)
        {
            var messageEntity       = new E_Message();
            var persistence         = new P_MeetingDevelopment();
            string message          = "";
            string extImageBase64   = "";
            string nameImage        = "";
            string imageBase64      = "";

            foreach (E_MeetingDevelopment entity in entityList)
            {
                var meetingDevFileImage = entity.MeetingDevFileImage;
                if (meetingDevFileImage != null)
                {
                    nameImage = Path.GetFileName(meetingDevFileImage.FileName);
                    string extFile = Path.GetExtension(meetingDevFileImage.FileName).ToLower();

                    // Get file extension and set image extension for base64
                    switch (extFile)
                    {
                        case ".png":
                            extImageBase64 = "data:image/png;base64,";
                            break;
                        case ".jpg":
                            extImageBase64 = "data:image/jpg;base64,";
                            break;
                        case ".jpeg":
                            extImageBase64 = "data:image/jpeg;base64,";
                            break;
                    }

                    // Reduce the size of the image
                    WebImage img = new WebImage(meetingDevFileImage.InputStream);
                    if (img.Width > 1024)
                    {
                        img.Resize(1024, 768);
                    }

                    // Convert image to Base64 String
                    imageBase64 = Convert.ToBase64String(img.GetBytes());
                }
                else
                {
                    imageBase64 = entity.MeetingDevImage;
                    extImageBase64 = entity.MeetingDevExtImage;
                    nameImage = entity.MeetingDevNameImage;
                }
                var meetingDevEntity = new E_MeetingDevelopment()
                {
                    MeetingCode             = entity.MeetingCode,
                    MeetingDevCode          = entity.MeetingDevCode,
                    MeetingDevDescription   = entity.MeetingDevDescription,
                    MeetingDevTitle         = entity.MeetingDevTitle,
                    MeetingDevImage         = imageBase64,
                    MeetingDevExtImage      = extImageBase64,
                    MeetingDevNameImage     = nameImage
                };
                message = persistence.insertMeetingDev(meetingDevEntity);

            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}