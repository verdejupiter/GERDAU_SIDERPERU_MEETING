using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using MeetingRecord.AppWeb.Helper.HelperFunction;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Web.Mvc;

namespace MeetingRecord.AppWeb.Controllers
{
    public class ActionPlanDetailController : Controller
    {
        public JsonResult insertActionPlanDetail(List<E_ActionPlanDetail> entityList)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlanDetail();
            string message = "";
            foreach (E_ActionPlanDetail entity in entityList)
            {
                var file = entity.ActionPlanDetailFile;
                if (file != null && file.ContentLength > 0)
                {
                    //string encryptApCode = HelperFunction.encryptCode(entity.ActionPlanCode);
                    string encryptApCode = entity.ActionPlanCode;

                    string actionPlanPath = Server.MapPath("~/Content/file/ActionPlanDetail/" + encryptApCode);
                    bool exists = Directory.Exists(actionPlanPath);

                    if (!exists)
                    {
                        Directory.CreateDirectory(actionPlanPath);
                    }

                    string fileName = Path.GetFileName(file.FileName);
                    string fileExt  = Path.GetExtension(file.FileName);

                    //string encryptApdCode = HelperFunction.encryptCode(entity.ActionPlanDetailCode);
                    string encryptApdCode = entity.ActionPlanDetailCode;

                    string filePath = "Content/file/ActionPlanDetail/" + encryptApCode + "/" + encryptApdCode + fileExt;
                    file.SaveAs(Path.Combine(actionPlanPath, encryptApdCode + fileExt));

                    var apDetailEntity = new E_ActionPlanDetail()
                    {
                        ActionPlanCode              = entity.ActionPlanCode,
                        ActionPlanDetailCode        = entity.ActionPlanDetailCode,
                        ActionPlanDetailPathFile    = filePath,
                        ActionPlanDetailNameFile    = encryptApdCode,
                        ActionPlanDetailExtFile     = fileExt,
                        ActionPlanDetailCaptionFile = fileName
                    };
                    message = persistence.insertActionPlanDetail(apDetailEntity);
                }
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getActionPlanDetailByActionPlanCode(string actionPlanCode)
        {
            string jsonString;
            var persistence = new P_ActionPlanDetail();
            DataSet dtsActionPlanDetail = persistence.getActionPlanDetailByActionPlanCode(actionPlanCode);
            if (dtsActionPlanDetail.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlanDetail.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsActionPlanDetail, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteActionPlanDetail(E_ActionPlanDetail entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlanDetail();
            string message = persistence.deleteActionPlanDetail(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5

    }
}