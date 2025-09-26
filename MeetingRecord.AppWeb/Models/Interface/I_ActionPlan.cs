using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_ActionPlan
    {       
        DataSet getActionPlanByMeetingCode(string meetingCode);
        DataSet getActionPlanPendingByArgs(
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
             string dateFilterType = "scheduled"
        ); //@AMENDEZ5
        DataSet getActionPlanExecutedByArgs(
            int responsibleUserId,
            string startDate,
            string endDate,
            string meetingCode = "0",
            string typeMeetingCode = "0",
            int areaId = 0,
            int userId = 0,
            string description = "0",
            bool mineScope = false,
            int actionPlanCategoryId = 0,
            string actionPlanPriority = "0",
            int actionPlanStatus = 0,
            string dateFilterType = "executed"
        ); //@AMENDEZ5
        DataSet getActionPlanByUserId(int responsibleUserId);
        string insertActionPlan(E_ActionPlan entity);
        string updateActionPlan(E_ActionPlan entity); //@AMENDEZ5
        string deleteActionPlan(string actionPlanCode); //@AMENDEZ5
        string executeActionPlan(E_ActionPlan entity);
        //DataSet getAllActionPlanCategory(); //@AMENDEZ5
        DataSet getActionPlanByCode(string actionPlanCode); //@AMENDEZ5
        string updateActionPlanComments(E_ActionPlan entity); //@AMENDEZ5
        DataSet getActionPlanPendingExportToExcel(
            int responsibleUserId,
            string meetingCode,
            string startDate,
            string endDate,
            int userId,
            bool mineScope,
            int actionPlanStatus,
            string actionPlanPriority,
            int actionPlanCategoryId,
            string dateFilterType
        ); //@AMENDEZ5
        DataSet getActionPlanExecutedExportToExcel(
            int responsibleUserId,
            string meetingCode,
            string startDate,
            string endDate,
            int userId,
            bool mineScope,
            int actionPlanStatus,
            string actionPlanPriority,
            int actionPlanCategoryId,
            string dateFilterType
        ); //@AMENDEZ5
    }
}
