namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_ActionPlanDetail
    {
        #region Stored Procedure
        public const string SP_INSERT_ACTION_PLAN_DETAIL            = "SP_InsertActionPlanDetail";
        public const string SP_GET_ACTION_PLAN_DETAIL_BY_AP_CODE    = "SP_GetActionPlanDetailByActionPlanCode";
        public const string SP_DELETE_ACTION_PLAN_DETAIL = "SP_DeleteActionPlanDetail"; //@AMENDEZ5

        #endregion

        #region Parameters
        public const string PARAM_ACTION_PLAN_DETAIL_CODE           = "@ActionPlanDetailCode";
        public const string PARAM_ACTION_PLAN_DETAIL_PATH_FILE      = "@ActionPlanDetailPathFile";
        public const string PARAM_ACTION_PLAN_DETAIL_NAME_FILE      = "@ActionPlanDetailNameFile";
        public const string PARAM_ACTION_PLAN_DETAIL_EXT_FILE       = "@ActionPlanDetailExtFile";
        public const string PARAM_ACTION_PLAN_DETAIL_CAPTION_FILE   = "@ActionPlanDetailCaptionFile";
        public const string PARAM_ACTION_PLAN_DETAIL_VERSION        = "@ActionPlanDetailVersion";
        #endregion
    }
}