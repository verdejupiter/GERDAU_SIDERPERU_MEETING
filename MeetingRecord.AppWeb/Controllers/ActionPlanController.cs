using System;
using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MeetingRecord.AppWeb.Helper.HelperFunction;
namespace MeetingRecord.AppWeb.Controllers
{
    public class ActionPlanController : Controller
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

        public JsonResult insertActionPlan(List<E_ActionPlan> entityList)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlan();
            string message = "";
            foreach (E_ActionPlan entity in entityList)
            {
                message = persistence.insertActionPlan(entity);
            }
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult updateActionPlan(E_ActionPlan entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlan();
            string message = persistence.updateActionPlan(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }//@AMENDEZ5

        public JsonResult deleteActionPlan(string actionPlanCode)
        {
            var result = new P_ActionPlan().deleteActionPlan(actionPlanCode);
            return Json(new { result = result });
        } //@AMENDEZ5

        public JsonResult getActionPlanPendingByArgs(
    int responsibleUserId,
    string meetingCode = "0",
    string typeMeetingCode = "0",
    int areaId = 0,
    string startDate = null,
    string endDate = null,
    int userId = 0,
    string description = "0",
    int actionPlanStatus = 0,
    string actionPlanPriority = "0",
    bool mineScope = false,
    int actionPlanCategoryId = 0,
    string dateFilterType = "scheduled")
        {
            if (mineScope)
            {
                responsibleUserId = Convert.ToInt32(Session["UserId"]);
                userId = 0;
            }
            else if (responsibleUserId == 0 && userId == 0)
            {
                responsibleUserId = 0;
            }

            var persistence = new P_ActionPlan();
            DataSet dtsActionPlan = persistence.getActionPlanPendingByArgs(
                responsibleUserId,
                meetingCode,
                typeMeetingCode,
                areaId,
                startDate,
                endDate,
                userId,
                description,
                actionPlanStatus,
                actionPlanPriority,
                mineScope,
                actionPlanCategoryId,
                dateFilterType);

            System.Diagnostics.Debug.WriteLine("DataSet recibido: " + (dtsActionPlan != null ? "No nulo" : "Nulo"));
            if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0)
            {
                System.Diagnostics.Debug.WriteLine("Primera tabla: " + dtsActionPlan.Tables[0].TableName);
                System.Diagnostics.Debug.WriteLine("Filas: " + dtsActionPlan.Tables[0].Rows.Count);
            }

            if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0 && dtsActionPlan.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();

                return Json(new
                {
                    success = false,
                    error = messageError,
                    ActionPlan = new object[0] 
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var actionPlans = new List<Dictionary<string, object>>();

                if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0 && dtsActionPlan.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dtsActionPlan.Tables[0].Rows)
                    {
                        var item = new Dictionary<string, object>();
                        foreach (DataColumn col in dtsActionPlan.Tables[0].Columns)
                        {
                            item[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                        }
                        actionPlans.Add(item);
                    }
                }

                return Json(new
                {
                    success = true,
                    ActionPlan = actionPlans
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult getActionPlanExecutedByArgs(
    int responsibleUserId,
    string startDate = null,
    string endDate = null,
    string meetingCode = "0",
    string typeMeetingCode = "0",
    int areaId = 0,
    int userId = 0,
    string description = "0",
    bool mineScope = false,
    int actionPlanCategoryId = 0,
    string actionPlanPriority = "0",
    int actionPlanStatus = 0,
    string dateFilterType = "executed")
        {
            if (mineScope)
            {
                responsibleUserId = Convert.ToInt32(Session["UserId"]);
                userId = 0;
            }
            else if (responsibleUserId == 0 && userId == 0)
            {
                responsibleUserId = 0;
            }

            var persistence = new P_ActionPlan();
            DataSet dtsActionPlan = persistence.getActionPlanExecutedByArgs(
                responsibleUserId,
                startDate,
                endDate,
                meetingCode,
                typeMeetingCode,
                areaId,
                userId,
                description,
                mineScope,
                actionPlanCategoryId,
                actionPlanPriority,
                actionPlanStatus,
                dateFilterType);

            System.Diagnostics.Debug.WriteLine("DataSet recibido: " + (dtsActionPlan != null ? "No nulo" : "Nulo"));
            if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0)
            {
                System.Diagnostics.Debug.WriteLine("Primera tabla: " + dtsActionPlan.Tables[0].TableName);
                System.Diagnostics.Debug.WriteLine("Filas: " + dtsActionPlan.Tables[0].Rows.Count);
            }

            if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0 && dtsActionPlan.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);

                return Json(new
                {
                    error = messageError,
                    ActionPlan = new object[0] 
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var actionPlans = new List<Dictionary<string, object>>();

                if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0 && dtsActionPlan.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dtsActionPlan.Tables[0].Rows)
                    {
                        var item = new Dictionary<string, object>();
                        foreach (DataColumn col in dtsActionPlan.Tables[0].Columns)
                        {
                            item[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                        }
                        actionPlans.Add(item);
                    }
                }

                return Json(new
                {
                    success = true,
                    ActionPlan = actionPlans
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult getActionPlanByUserId(int responsibleUserId)
        {
            string jsonString;
            var persistence = new P_ActionPlan();
            responsibleUserId = responsibleUserId != 0 ? responsibleUserId : Convert.ToInt16(Session["UserId"]);
            DataSet dtsActionPlan = persistence.getActionPlanByUserId(responsibleUserId);
            if (dtsActionPlan.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsActionPlan, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getActionPlanByMeetingCode(string meetingCode)
        {
            string jsonString;
            var persistence = new P_ActionPlan();
            DataSet dtsActionPlan = persistence.getActionPlanByMeetingCode(meetingCode);
            if (dtsActionPlan.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsActionPlan, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }

        /*public JsonResult getActionPlanExecutedByArgs(int responsibleUserId, string startDate, string endDate)
        {
            string jsonString;
            var persistence = new P_ActionPlan();
            responsibleUserId = responsibleUserId != 0 ? responsibleUserId : Convert.ToInt16(Session["UserId"]);
            DataSet dtsActionPlan = persistence.getActionPlanExecutedByArgs(responsibleUserId, startDate, endDate);
            if (dtsActionPlan.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsActionPlan, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        }*/

        public JsonResult executeActionPlan(E_ActionPlan entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlan();
            string message = "";
            message = persistence.executeActionPlan(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }
        /*public JsonResult getAllActionPlanCategory()
        {
            string jsonString;
            var persistence = new P_ActionPlan();
            DataSet dtsActionPlanCategory = persistence.getAllActionPlanCategory();
            if (dtsActionPlanCategory.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlanCategory.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            }
            else
            {
                jsonString = JsonConvert.SerializeObject(dtsActionPlanCategory, Formatting.Indented);
            }
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5 */

        public JsonResult getActionPlanByCode(string actionPlanCode)
        {
            var persistence = new P_ActionPlan();
            DataSet dtsActionPlan = persistence.getActionPlanByCode(actionPlanCode);

            if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0 && dtsActionPlan.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();

                return Json(new
                {
                    success = false,
                    error = messageError,
                    ActionPlan = new object[0]
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var actionPlans = new List<Dictionary<string, object>>();

                if (dtsActionPlan != null && dtsActionPlan.Tables.Count > 0 && dtsActionPlan.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dtsActionPlan.Tables[0].Rows)
                    {
                        var item = new Dictionary<string, object>();
                        foreach (DataColumn col in dtsActionPlan.Tables[0].Columns)
                        {
                            item[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                        }
                        actionPlans.Add(item);
                    }
                }

                return Json(new
                {
                    success = true,
                    ActionPlan = actionPlans
                }, JsonRequestBehavior.AllowGet);
            }
        }//@AMENDEZ5
        public JsonResult updateActionPlanComments(E_ActionPlan entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_ActionPlan();
            string message = persistence.updateActionPlanComments(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5

        public JsonResult getActionPlanPendingExportToExcel(
            int responsibleUserId,
            string meetingCode,
            string startDate,
            string endDate,
            int userId,
            bool mineScope,
            int actionPlanStatus,
            string actionPlanPriority,
            int actionPlanCategoryId,
            string dateFilterType)
        {
            string jsonString;
            E_Message messageEntity = new E_Message();
            DataSet dtsMessage;

            var persistence = new P_ActionPlan();

            DataSet dtsActionPlan = persistence.getActionPlanPendingExportToExcel(
                responsibleUserId,
                meetingCode,
                startDate,
                endDate,
                userId,
                mineScope,
                actionPlanStatus,
                actionPlanPriority,
                actionPlanCategoryId,
                dateFilterType);

            if (dtsActionPlan.Tables[0].TableName == "Error")
            {
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();
                dtsMessage = messageEntity.getDtsMessage(messageError);
            }
            else
            {
                if (dtsActionPlan.Tables[0].Rows.Count > 0)
                {
                    HelperFunction.ExportToExcel(dtsActionPlan.Tables[0], "Planes_Accion_Pendientes");
                    dtsMessage = messageEntity.getDtsMessage("success");
                }
                else
                {
                    dtsMessage = messageEntity.getDtsMessage("empty");
                }
            }
            jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5

        public JsonResult getActionPlanExecutedExportToExcel(
        int responsibleUserId,
        string meetingCode,
        string startDate,
        string endDate,
        int userId,
        bool mineScope,
        int actionPlanStatus,
        string actionPlanPriority,
        int actionPlanCategoryId,
        string dateFilterType)
        {
            string jsonString;
            E_Message messageEntity = new E_Message();
            DataSet dtsMessage;

            var persistence = new P_ActionPlan();

            DataSet dtsActionPlan = persistence.getActionPlanExecutedExportToExcel(
                responsibleUserId,
                meetingCode,
                startDate,
                endDate,
                userId,
                mineScope,
                actionPlanStatus,
                actionPlanPriority,
                actionPlanCategoryId,
                dateFilterType);

            if (dtsActionPlan.Tables[0].TableName == "Error")
            {
                string messageError = dtsActionPlan.Tables["Error"].Rows[0]["message"].ToString();
                dtsMessage = messageEntity.getDtsMessage(messageError);
            }
            else
            {
                if (dtsActionPlan.Tables[0].Rows.Count > 0)
                {
                    HelperFunction.ExportToExcel(dtsActionPlan.Tables[0], "Planes_Accion_Ejecutados");
                    dtsMessage = messageEntity.getDtsMessage("success");
                }
                else
                {
                    dtsMessage = messageEntity.getDtsMessage("empty");
                }
            }
            jsonString = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(jsonString, JsonRequestBehavior.AllowGet);
        } //@AMENDEZ5
    }
} 