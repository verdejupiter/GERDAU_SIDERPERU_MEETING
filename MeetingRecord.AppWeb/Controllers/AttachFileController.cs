using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Model;
using MeetingRecord.AppWeb.Models.Persistence;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Text;
using System.Web.Mvc;
using MeetingRecord.AppWeb.Helper.HelperFunction;
using System.IO;

namespace MeetingRecord.AppWeb.Controllers
{
    public class AttachFileController : Controller
    {
        public JsonResult getAttachFileByMeetingCode(string meetingCode)
        {
            string jsonString;
            var persistence = new P_AttachFile();
            DataSet dtsAttachFile = persistence.getAttachFileByMeetingCode(meetingCode);
            if (dtsAttachFile.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsAttachFile.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsAttachFile, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }
        //#########################################################@AMENDEZ5
        public JsonResult insertAttachFile(string meetingCode, string[] attachFileTitles)
        {
            var messageEntity = new E_Message();
            var persistence = new P_AttachFile();
            string message = "";
            var files = Request.Files;

            for (int i = 0; i < files.Count; i++)
            {
                var file = files[i];
                if (file != null && file.ContentLength > 0)
                {
                    string attachFileCode = HelperFunction.GenerateCode("ATF");
                    string encryptMeetingCode = HelperFunction.encryptCode(meetingCode);
                    string attachFilePath = Server.MapPath("~/Content/file/AttachFile/" + encryptMeetingCode);
                    if (!Directory.Exists(attachFilePath))
                        Directory.CreateDirectory(attachFilePath);

                    string fileName = Path.GetFileName(file.FileName);
                    string fileExt = Path.GetExtension(file.FileName);
                    string encryptAttachFileCode = HelperFunction.encryptCode(attachFileCode);
                    string filePath = "Content/file/AttachFile/" + encryptMeetingCode + "/" + encryptAttachFileCode + fileExt;
                    file.SaveAs(Path.Combine(attachFilePath, encryptAttachFileCode + fileExt));

                    var attachFileEntity = new E_AttachFile()
                    {
                        AttachFileCode = attachFileCode,
                        MeetingCode = meetingCode,
                        AttachFileName = fileName,
                        AttachFileExtension = fileExt,
                        AttachFileTitle = attachFileTitles != null && attachFileTitles.Length > i ? attachFileTitles[i] : "",
                        AttachFilePath = filePath,
                        AttachFileRegisteredByUserId = Convert.ToInt32(Session["UserId"])
                    };
                    message = persistence.insertAttachFile(attachFileEntity);
                }
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        //#########################################################@AMENDEZ5

        /*
        public JsonResult insertAttachFile(E_AttachFile entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_AttachFile();
            string message = "";

            var file = entity.AttachFileBase;
            if (file != null && file.ContentLength > 0)
            {
                string encryptMeetingCode = HelperFunction.encryptCode(entity.MeetingCode);
                string attachFilePath = Server.MapPath("~/Content/file/AttachFile/" + encryptMeetingCode);
                bool exists = Directory.Exists(attachFilePath);

                if (!exists)
                {
                    Directory.CreateDirectory(attachFilePath);
                }

                string fileName = Path.GetFileName(file.FileName);
                string fileExt = Path.GetExtension(file.FileName);

                string encryptAttachFileCode = HelperFunction.encryptCode(entity.AttachFileCode);
                string filePath = "Content/file/AttachFile/" + encryptMeetingCode + "/" + encryptAttachFileCode + fileExt;
                file.SaveAs(Path.Combine(attachFilePath, encryptAttachFileCode + fileExt));

                var attachFileEntity = new E_AttachFile()
                {
                    AttachFileCode               = entity.AttachFileCode,
                    MeetingCode                  = entity.MeetingCode,
                    AttachFileName               = fileName,
                    AttachFileExtension          = fileExt,
                    AttachFileTitle              = entity.AttachFileTitle,
                    AttachFilePath               = filePath,
                    AttachFileRegisteredByUserId = Convert.ToInt16(Session["UserId"])
                };
                message = persistence.insertAttachFile(attachFileEntity);
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        */
        public JsonResult deleteAttachFile(string meetingCode, string attachFileCode, string attachFileExtension)
        {
            var messageEntity = new E_Message();
            var persistence = new P_AttachFile();
            string message = persistence.deleteAttachFile(attachFileCode);
            if(message == "Success")
            {
                string encryptMeetingCode = HelperFunction.encryptCode(meetingCode);
                string encryptAttachFileCode = HelperFunction.encryptCode(attachFileCode);
                string attachFilePath = Server.MapPath("~/Content/file/AttachFile/" + encryptMeetingCode + "/" + encryptAttachFileCode + attachFileExtension);
                bool exists = System.IO.File.Exists(attachFilePath);
                if (exists)
                {
                    System.IO.File.Delete(attachFilePath);
                }
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
    }
}