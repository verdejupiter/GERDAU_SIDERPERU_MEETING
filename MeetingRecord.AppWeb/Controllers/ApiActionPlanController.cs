using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Persistence;
using System;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MeetingRecord.AppWeb.Helper.HelperFunction;
using System.IO;
using System.Web;

namespace MeetingRecord.AppWeb.Controllers
{
    /// <summary>
    /// Controlador de api plan de acción |
    /// Author:      Jean Carlos Sánchez Castromonte |
    /// Update date: 20/11/2019
    /// </summary>
    public class ApiActionPlanController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage TaskGet(E_TaskFilter taskGetFilter)
        {
            var persistence = new P_ActionPlan();
            DataSet dts = persistence.TaskGet(taskGetFilter);
            if (dts.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dts.Tables[0]);
        }

        [HttpPost]
        public HttpResponseMessage TaskClose(E_Task task)
        {
            var persistence = new P_ActionPlan();
            DataSet dts = persistence.TaskClose(task);
            if (dts.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dts.Tables[0]);
        }

        [HttpPost]
        public HttpResponseMessage TaskDelete(E_Task task)
        {
            var persistence = new P_ActionPlan();
            DataSet dts = persistence.TaskDelete(task);
            if (dts.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dts.Tables[0]);
        }

        [HttpPost]
        public HttpResponseMessage TaskUpdate(E_Task task)
        {
            var persistence = new P_ActionPlan();
            DataSet dts = persistence.TaskUpdate(task);
            if (dts.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dts.Tables[0]);
        }

        [HttpPost]
        public HttpResponseMessage AnnexedInsert(E_Task task)
        {
            var persistence = new P_ActionPlan();
            var messageEntity = new E_Message();
            var dts = new DataSet();
            var dtsMessage = new DataSet();
            var dataTable = new DataTable();
            DataRow dataRow = null;
            dataTable.Columns.Add("ActionPlanId");
            dataTable.Columns.Add("ActionPlanDetailCode");
            dataTable.Columns.Add("ActionPlanDetailPathFile");
            dataTable.Columns.Add("ActionPlanDetailNameFile");
            dataTable.Columns.Add("ActionPlanDetailExtFile");
            dataTable.Columns.Add("ActionPlanDetailCaptionFile");
            try
            {               
                if (task.Files.Count > 0)
                {
                    foreach (var file in task.Files)
                    {
                        string actionPlanDetailCode = HelperFunction.GenerateCode("M-APD");
                        string actionPlanPath = HttpContext.Current.Server.MapPath("~/Content/file/ActionPlanDetail/" + task.TaskId);
                        bool exists = Directory.Exists(actionPlanPath);
                        if (!exists)
                        {
                            Directory.CreateDirectory(actionPlanPath);
                        }

                        string filePath = "Content/file/ActionPlanDetail/" + task.TaskId + "/" + actionPlanDetailCode + "." + file.Extension;
                        HelperFunction.SetFileFromBase64(actionPlanDetailCode, file.File, file.Extension, filePath);

                        dataRow = dataTable.NewRow();
                        dataRow["ActionPlanId"] = task.TaskId;
                        dataRow["ActionPlanDetailCode"] = actionPlanDetailCode;
                        dataRow["ActionPlanDetailPathFile"] = filePath;
                        dataRow["ActionPlanDetailNameFile"] = actionPlanDetailCode;
                        dataRow["ActionPlanDetailExtFile"] = "." + file.Extension;
                        dataRow["ActionPlanDetailCaptionFile"] = actionPlanDetailCode;
                        dataTable.Rows.Add(dataRow);                        
                    }
                    dts = persistence.AnnexedInsert(dataTable);
                }               
            }
            catch (Exception e)
            {
                if(dts.Tables.Count > 0)
                {
                    if (dts.Tables[0].TableName == "Error")
                    {
                        string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                        dtsMessage = messageEntity.getDtsMessage(messageError);
                        return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
                    }
                }
                dtsMessage = messageEntity.getDtsMessage(e.Message.ToString());
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dts.Tables[0]);
        }

        [HttpPost]
        public HttpResponseMessage AnnexedGet(E_Task task)
        {
            var persistence = new P_ActionPlan();
            var dts = new DataSet();
            var dtsMessage = new DataSet();
            var messageEntity = new E_Message();
            DataTable dataTable = new DataTable();
            dataTable.Columns.Add("TaskId");
            dataTable.Columns.Add("File");
            dataTable.Columns.Add("Extension");
            DataRow dataRow = null;

            try
            {
                dts = persistence.AnnexedGet(task.TaskId);
                if (dts.Tables[0].TableName == "ANNEXED_GET")
                {
                    if (dts.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dts.Tables[0].Rows)
                        {
                            string actionPlanDetailCode = row["ActionPlanDetailCode"].ToString();
                            string actionPlanDetailExtFile = row["ActionPlanDetailExtFile"].ToString();
                            string filePath = "Content/file/ActionPlanDetail/" + task.TaskId + "/" + actionPlanDetailCode + actionPlanDetailExtFile;
                            string actionPlanDetailFileBase64 = HelperFunction.GetBase64FromFile(filePath);
                            dataRow = dataTable.NewRow();
                            dataRow["TaskId"] = task.TaskId;
                            dataRow["File"] = actionPlanDetailFileBase64;
                            dataRow["Extension"] = actionPlanDetailExtFile.Replace(".", "");
                            dataTable.Rows.Add(dataRow);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                if (dts.Tables.Count > 0)
                {
                    if (dts.Tables[0].TableName == "Error")
                    {
                        string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                        dtsMessage = messageEntity.getDtsMessage(messageError);
                        return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
                    }
                }
                dtsMessage = messageEntity.getDtsMessage(e.Message.ToString());
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dataTable);
        }

        [HttpPost]
        public HttpResponseMessage TaskGetCountByResponsible(E_TaskFilter taskGetFilter)
        {
            var persistence = new P_ActionPlan();
            DataSet dts = persistence.TaskGetCountByResponsible(taskGetFilter.UserCode);
            if (dts.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dts.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                return Request.CreateResponse(HttpStatusCode.Conflict, dtsMessage.Tables[0]);
            }
            return Request.CreateResponse(HttpStatusCode.OK, dts.Tables[0]);
        }
    }
}