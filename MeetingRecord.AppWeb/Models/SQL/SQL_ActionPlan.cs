namespace MeetingRecord.AppWeb.Models.SQL
{
    /// <summary>
    /// Libreria de constantes SQL de plan de acción. |
    /// Author:      Jean Carlos Sánchez Castromonte |
    /// Update date: 20/11/2019
    /// </summary>
    public class SQL_ActionPlan
    {
        #region Stored Procedure
        public const string SP_GET_ACTION_PLAN_BY_MEETING_CODE  = "SP_GetActionPlanByMeetingCode";
        public const string SP_GET_ACTION_PLAN_BY_USER_ID       = "SP_GetActionPlanByUserId";
        public const string SP_GET_ACTION_PLAN_PENDING_BY_ARGS  = "SP_GetActionPlanPendingByArgs"; //@AMENDEZ5
        public const string SP_GET_ACTION_PLAN_EXECUTED_BY_ARGS = "SP_GetActionPlanExecutedByArgs";
        public const string SP_INSERT_ACTION_PLAN               = "SP_InsertActionPlan";
        public const string SP_EXECUTE_ACTION_PLAN              = "SP_ExecuteActionPlan";
        //public const string SP_GET_ALL_ACTION_PLAN_CATEGORY     = "SP_GetAllActionPlanCategory"; //@AMENDEZ5
        public const string SP_UPDATE_ACTION_PLAN               = "SP_UpdateActionPlan"; //@AMENDEZ5
        public const string SP_DELETE_ACTION_PLAN               = "SP_DeleteActionPlan"; //@AMENDEZ5
        public const string SP_GET_ACTION_PLAN_BY_CODE          = "SP_GetActionPlanByCode";  //@AMENDEZ5
        public const string SP_UPDATE_ACTION_PLAN_COMMENTS      = "SP_UpdateActionPlanComments"; //@AMENDEZ5
        public const string SP_GET_ACTION_PLAN_EXPORT_TO_EXCEL  = "SP_GetActionPlanExportToExcel"; //@AMENDEZ5
        public const string SP_GET_ACTION_PLAN_EXECUTED_EXPORT_TO_EXCEL  = "SP_GetActionPlanExecutedExportToExcel"; //@AMENDEZ5
        public const string SP_GET_ACTION_PLAN_PENDING_EXPORT_TO_EXCEL  = "SP_GetActionPlanPendingExportToExcel"; //@AMENDEZ5

        // Stored procedure of api task
        public const string SP_TASK_GET                         = "SP_TaskGet";
        public const string SP_TASK_CLOSE                       = "SP_TaskClose";
        public const string SP_TASK_DELETE                      = "SP_TaskDelete";
        public const string SP_TASK_UPDATE                      = "SP_TaskUpdate";
        public const string SP_ANNEXED_INSERT                   = "SP_AnnexedInsert";
        public const string SP_ANNEXED_GET                      = "SP_AnnexedGet";
        public const string SP_TASK_GET_COUNT_BY_RESPONSIBLE    = "SP_TaskGetCountByResponsible";
        #endregion

        #region Parameters
        public const string PARAM_ACTION_PLAN_CODE              = "@ActionPlanCode";
        public const string PARAM_ACTION_PLAN_WHAT              = "@ActionPlanWhat";
        public const string PARAM_ACTION_PLAN_WHY               = "@ActionPlanWhy";
        public const string PARAM_RESPONSIBLE_USER_ID           = "@ResponsibleUserId";
        public const string PARAM_ACTION_PLAN_SCHEDULED_DATE    = "@ActionPlanScheduledDate";
        public const string PARAM_ACTION_PLAN_EXECUTED_DESC     = "@ActionPlanExecutedDesc";
        public const string PARAM_EXECUTED_DATE                 = "@ActionPlanExecutedDate";
        public const string PARAM_ACTION_PLAN_STATUS            = "@ActionPlanStatus";
        public const string PARAM_ACTION_PLAN_VERSION           = "@ActionPlanVersion";
        public const string PARAM_ACTION_PLAN_PRIORITY          = "@ActionPlanPriority"; //@AMENDEZ5
        public const string PARAM_ACTION_PLAN_CATEGORY_ID       = "@ActionPlanCategoryId"; //@AMENDEZ5
        public const string PARAM_DATE_FILTER_TYPE              = "@DateFilterType"; //@AMENDEZ5

        // Parameters of api task
        public const string PARAM_USER_CODE                     = "@UserCode";
        public const string PARAM_START_DATE                    = "@StartDate";
        public const string PARAM_END_DATE                      = "@EndDate";
        public const string PARAM_AREA_ID                       = "@AreaId";
        public const string PARAM_CELL_ID                       = "@CellId";
        public const string PARAM_TYPE                          = "@Type";
        public const string PARAM_TASK_ID                       = "@TaskId";
        public const string PARAM_TASK_EXECUTED_DATE            = "@ExecutedDate";
        public const string PARAM_TASK_OBSERVATION              = "@Observation";
        public const string PARAM_TASK_EXECUTED_BY              = "@ExecutedBy";
        public const string PARAM_TASK_WHAT                     = "@What";
        public const string PARAM_TASK_SCHEDULED_DATE           = "@ScheduledDate";
        public const string PARAM_TASK_RESPONSIBLE              = "@Responsible";
        public const string PARAM_TASK_USER_REGISTER            = "@UserRegister";
        public const string PARAM_TASK_TABLE                    = "@TaskTable";
        #endregion
    }
}