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
using System.Collections.Generic;

namespace MeetingRecord.AppWeb.Controllers
{
    public class MeetingController : Controller
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

        public ActionResult MeetingList()
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

        public ActionResult MeetingDetail(string meetingCode)
        {
            if (Session.Count > 0)
            {
                string decodeMeetingCode = "";
                try
                {
                    byte[] bytes = Convert.FromBase64String(meetingCode);
                    decodeMeetingCode = Encoding.Default.GetString(bytes);
                }
                catch
                {
                    return RedirectToAction("MeetingList", "Meeting");

                }

                var perMeeting = new P_Meeting();
                var perGuide = new P_Guide();
                var perUserAssistance = new P_UserAssistance();
                var perMeetingDev = new P_MeetingDevelopment();
                var perActionPlan = new P_ActionPlan();

                var meetingModel = new M_Meeting()
                {
                    dtsMeeting = perMeeting.getMeetingByCode(decodeMeetingCode),
                    dtsGuide = perGuide.getGuideByMeetingCode(decodeMeetingCode),
                    dtsUserAssistance = perUserAssistance.getUserAssistanceByMeetingCode(decodeMeetingCode),
                    dtsMeetingDev = perMeetingDev.getMeetingDevByMeetingCode(decodeMeetingCode),
                    dtsActionPlan = perActionPlan.getActionPlanByMeetingCode(decodeMeetingCode)
                };

                int count = meetingModel.dtsMeeting.Tables[0].Rows.Count;
                if (count > 0)
                {
                    return View(meetingModel);

                }
                return RedirectToAction("MeetingList", "Meeting");
            }
            return RedirectToAction("Login", "Home");
        }

        public ActionResult MeetingDetailPDF(string meetingCode)
        {
            var perMeeting = new P_Meeting();
            var perGuide = new P_Guide();
            var perUserAssistance = new P_UserAssistance();
            var perMeetingDev = new P_MeetingDevelopment();
            var perActionPlan = new P_ActionPlan();
            var meetingModel = new M_Meeting()
            {
                dtsMeeting = perMeeting.getMeetingByCode(meetingCode),
                dtsGuide = perGuide.getGuideByMeetingCode(meetingCode),
                dtsUserAssistance = perUserAssistance.getUserAssistanceByMeetingCode(meetingCode),
                dtsMeetingDev = perMeetingDev.getMeetingDevByMeetingCode(meetingCode),
                dtsActionPlan = perActionPlan.getActionPlanByMeetingCode(meetingCode)
            };
            return View("~/Views/Meeting/MeetingDetailPDF.cshtml", meetingModel);
        }

        public ActionResult MeetingRegister()
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

        public ActionResult MeetingEdit(string meetingCode)
        {
            if (Session.Count > 0)
            {
                string decodeMeetingCode = "";
                try
                {
                    byte[] bytes = Convert.FromBase64String(meetingCode);
                    decodeMeetingCode = Encoding.Default.GetString(bytes);
                }
                catch
                {
                    return RedirectToAction("MeetingList", "Meeting");

                }

                var perMeeting = new P_Meeting();
                var perGuide = new P_Guide();
                var perUserAssistance = new P_UserAssistance();
                var perMeetingDev = new P_MeetingDevelopment();
                var perActionPlan = new P_ActionPlan();
                var dtsAttachFile = perMeeting.getAttachFileByMeetingCode(decodeMeetingCode); //

                var meetingModel = new M_Meeting()
                {
                    dtsMeeting = perMeeting.getMeetingByCode(decodeMeetingCode),
                    dtsGuide = perGuide.getGuideByMeetingCode(decodeMeetingCode),
                    dtsUserAssistance = perUserAssistance.getUserAssistanceByMeetingCode(decodeMeetingCode),
                    dtsMeetingDev = perMeetingDev.getMeetingDevByMeetingCode(decodeMeetingCode),
                    dtsActionPlan = perActionPlan.getActionPlanByMeetingCode(decodeMeetingCode),
                    dtsAttachFile = dtsAttachFile
                };
                int count = meetingModel.dtsMeeting.Tables[0].Rows.Count;
                if (count > 0)
                {
                    ViewBag.UserRole = Session["UserRole"]; //@AMENDEZ5
                    ViewBag.UserId = Session["UserId"]; //@AMENDEZ5

                    return View(meetingModel);

                }
                return RedirectToAction("MeetingList", "Meeting");

            }
            return RedirectToAction("Login", "Home");
        }

        //===================================================================================================================================================

        public JsonResult insertMeeting(E_Meeting entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_Meeting();
            string message = persistence.insertMeeting(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult updateMeeting(E_Meeting entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_Meeting();
            string message = persistence.updateMeeting(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteMeeting(string meetingCode, int deletedByUserId)
        {
            byte[] bytes = Convert.FromBase64String(meetingCode);
            string decodeMeetingCode = Encoding.Default.GetString(bytes);

            // Delete all files of action Plan by MeetingCode
            deleteAllFilesActionPlan(decodeMeetingCode);

            // Delete file meeting pdf
            deleteFileMeetingPdf(decodeMeetingCode);

            // Delete directory of Attach files
            deleteDirectoryAttachFile(decodeMeetingCode);

            var messageEntity = new E_Message();
            var persistence = new P_Meeting();
            string message = persistence.deleteMeeting(decodeMeetingCode, deletedByUserId);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteAllMeetingDetail(string meetingCode)
        {
            byte[] bytes = Convert.FromBase64String(meetingCode);
            string decodeMeetingCode = Encoding.Default.GetString(bytes);

            var messageEntity = new E_Message();
            var persistence = new P_Meeting();
            string message = persistence.deleteAllMeetingDetail(decodeMeetingCode);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMeetingByArgs(
            int? meetingId = null,
            int? areaId = null,
            int? cellId = null,
            string typeMeetingCode = null,
            string startDate = null,
            string endDate = null,
            int? userId = null,
            string description = null,
            bool mineScope = false,           // @AMENDEZ5
            string meetingCode = "",          // @AMENDEZ5
            int? creatorUserId = null )      // @AMENDEZ5 4/08
        {
            // Asignar valores por defecto si algún parámetro es nulo o vacío
            int meetingIdValue = meetingId ?? 0;
            int areaIdValue = areaId ?? 0;
            int cellIdValue = cellId ?? 0;
            string typeMeetingCodeValue = string.IsNullOrWhiteSpace(typeMeetingCode) ? "0" : typeMeetingCode;
            string startDateValue = string.IsNullOrWhiteSpace(startDate) ? "1900-01-01" : startDate;
            string endDateValue = string.IsNullOrWhiteSpace(endDate) ? "1900-01-01" : endDate;
            int userIdValue = userId ?? 0;
            string descriptionValue = string.IsNullOrWhiteSpace(description) ? "0" : description;
            int creatorUserIdValue = creatorUserId ?? 0; // @AMENDEZ5 4/08

            var persistence = new P_Meeting();
            DataSet dtsMeeting = persistence.getMeetingByArgs(
                meetingIdValue,
                areaIdValue,
                cellIdValue,
                typeMeetingCodeValue,
                startDateValue,
                endDateValue,
                userIdValue,
                descriptionValue,
                mineScope,
                meetingCode,
                creatorUserIdValue // @AMENDEZ5 4 / 08
            );

            string jsonString;
            if (dtsMeeting.Tables.Count > 0 && dtsMeeting.Tables[0].TableName == "Error")
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


        public JsonResult getMeetingByArgsExportToExcel(int meetingId, int areaId, int cellId, string typeMeetingCode,
            string startDate, string endDate, int userId, string description, string meetingCode,
            bool? mineScope = false, int? creatorUserId = null)
        {
            string jsonString;
            E_Message messageEntity = new E_Message();
            DataSet dtsMessage;
            var persistence = new P_Meeting();
            bool mineScopeValue = mineScope ?? false;
            int creatorUserIdValue = creatorUserId ?? 0;
            DataSet dtsMeeting = persistence.getMeetingByArgsExportToExcel(
            meetingId, areaId, cellId, typeMeetingCode, startDate, endDate, userId, description, meetingCode, mineScopeValue, creatorUserIdValue);

            if (dtsMeeting.Tables[0].TableName == "Error")
            {
                string messageError = dtsMeeting.Tables["Error"].Rows[0]["message"].ToString();
                dtsMessage = messageEntity.getDtsMessage(messageError);
            }
            else
            {
                if (dtsMeeting.Tables[0].Rows.Count > 0)
                {
                    HelperFunction.ExportToExcel(dtsMeeting.Tables[0], "Reporte_Reunión");
                    dtsMessage = messageEntity.getDtsMessage("success");
                }
                else
                {
                    dtsMessage = messageEntity.getDtsMessage("empty");
                }
            }
            jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMeetingByCodeSavePdf(string meetingCode)
        {
            var persistence = new P_Meeting();
            DataSet dtsMeeting = persistence.getMeetingByCode(meetingCode);
            string typeMeetingDescription = dtsMeeting.Tables[0].Rows[0]["TypeMeetingDescription"].ToString();
            string fileNamePDF = typeMeetingDescription + " -  #" + meetingCode + ".pdf";
            string message;
            var options = new Rotativa.Core.DriverOptions()
            {
                PageOrientation = Rotativa.Core.Options.Orientation.Portrait,
                PageSize = Rotativa.Core.Options.Size.A4,
                PageMargins = new Rotativa.Core.Options.Margins(10, 20, 20, 20),
                CustomSwitches = "--page-offset 0 --footer-center [page] --footer-font-size 8"
            };
            var rotativa = new Rotativa.MVC.ActionAsPdf("MeetingDetailPDF", new { meetingCode = meetingCode })
            {
                FileName = fileNamePDF,
                RotativaOptions = options
            };
            try
            {
                var pdfPath = Server.MapPath("~/Content/file/Meeting/" + fileNamePDF);
                bool exists = System.IO.File.Exists(pdfPath);
                if (exists)
                {
                    System.IO.File.Delete(pdfPath);
                }
                var byteArray = rotativa.BuildPdf(ControllerContext);
                var fileStream = new FileStream(pdfPath, FileMode.Create, FileAccess.Write);
                fileStream.Write(byteArray, 0, byteArray.Length);
                fileStream.Close();
                persistence.sendEmailPDFMeetingByParticipants(meetingCode, fileNamePDF);
                message = "Success";
            }
            catch (Exception e)
            {
                message = e.Message;
            }
            E_Message messageEntity = new E_Message();
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getMeetingByCodeExportToPDF(string meetingCode)
        {
            var persistence = new P_Meeting();
            DataSet dtsMeeting = persistence.getMeetingByCode(meetingCode);
            string typeMeetingDescription = dtsMeeting.Tables[0].Rows[0]["TypeMeetingDescription"].ToString();
            string fileNamePDF = typeMeetingDescription + " -  #" + meetingCode + ".pdf";


            var options = new Rotativa.Core.DriverOptions()
            {
                PageOrientation = Rotativa.Core.Options.Orientation.Portrait,
                PageSize = Rotativa.Core.Options.Size.A4,
                PageMargins = new Rotativa.Core.Options.Margins(10, 20, 20, 20),
                CustomSwitches = "--page-offset 0 --footer-center [page] --footer-font-size 8"
            };

            return new Rotativa.MVC.ActionAsPdf("MeetingDetailPDF", new { meetingCode = meetingCode })
            {
                FileName = fileNamePDF,
                RotativaOptions = options
            };
        }

        private void deleteAllFilesActionPlan(string meetingCode)
        {
            var perActionPlan = new P_ActionPlan();
            DataSet dtsActionPlan = perActionPlan.getActionPlanByMeetingCode(meetingCode);
            if (dtsActionPlan.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in dtsActionPlan.Tables[0].Rows)
                {
                    string encryptApCode = HelperFunction.encryptCode(row["ActionPlanCode"].ToString());
                    string actionPlanPath = Server.MapPath("~/Content/file/ActionPlanDetail/" + encryptApCode + "/");
                    bool exists = Directory.Exists(actionPlanPath);
                    if (exists)
                    {
                        Directory.Delete(actionPlanPath, true);
                    }
                }
            }
        }

        private void deleteFileMeetingPdf(string meetingCode)
        {
            var persistence = new P_Meeting();
            DataSet dtsMeeting = persistence.getMeetingByCode(meetingCode);
            string meetingId = dtsMeeting.Tables[0].Rows[0]["MeetingId"].ToString();
            string typeMeetingDescription = dtsMeeting.Tables[0].Rows[0]["TypeMeetingDescription"].ToString();
            string fileNamePDF = typeMeetingDescription + " -  #" + meetingId + ".pdf";
            string pdfPath = Server.MapPath("~/Content/file/Meeting/" + fileNamePDF);
            bool exists = System.IO.File.Exists(pdfPath);
            if (exists)
            {
                System.IO.File.Delete(pdfPath);
            }
        }

        private void deleteDirectoryAttachFile(string meetingCode)
        {
            string encryptMeetingCode = HelperFunction.encryptCode(meetingCode);
            string attachFilePath = Server.MapPath("~/Content/file/AttachFile/" + encryptMeetingCode);
            bool exists = Directory.Exists(attachFilePath);
            if (exists)
            {
                Directory.Delete(attachFilePath, true);
            }
        }

        public ActionResult getNewMeetingCode()
        {
            var persistence = new P_Meeting();
            string newCode = persistence.generateNewMeetingCode();
            return Content(newCode);
        } //@AMENDEZ5

        public JsonResult getAllArea()
        {
            var persistence = new P_Meeting();
            var result = new { Area = persistence.getAllArea() };
            return Json(result, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5

        public JsonResult getMeetingCodesAutocomplete(string term)
        {
            var pMeeting = new P_Meeting();
            var dt = pMeeting.GetMeetingCodeByText(term ?? "");
            var codes = new List<string>();
            foreach (DataRow row in dt.Rows)
            {
                codes.Add(row["MeetingCode"].ToString());
            }
            return Json(new { MeetingCodes = codes }, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5

    }
}