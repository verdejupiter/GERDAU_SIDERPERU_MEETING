namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_ActionPlanCategory
    {
        #region Stored Procedure        
        public const string SP_GET_ALL_ACTION_PLAN_CATEGORY = "SP_GetAllActionPlanCategory";
        public const string SP_INSERT_ACTION_PLAN_CATEGORY = "SP_InsertActionPlanCategory";
        public const string SP_UPDATE_ACTION_PLAN_CATEGORY = "SP_UpdateActionPlanCategory";
        public const string SP_DELETE_ACTION_PLAN_CATEGORY = "SP_DeleteActionPlanCategory";
        public const string SP_GET_ALL_ACTION_PLAN_CATEGORY_ACTIVE = "SP_GetAllActionPlanCategoryActive";

        #endregion

        #region Parameters
        public const string PARAM_ACTION_PLAN_CATEGORY_ID = "@ActionPlanCategoryId";
        public const string PARAM_ACTION_PLAN_CATEGORY_NAME = "@ActionPlanCategoryName";
        public const string PARAM_REGISTERED_BY_USER_ID = "@RegisteredByUserId";
        public const string PARAM_ACTION_PLAN_CATEGORY_STATUS = "@ActionPlanCategoryStatus";
        public const string PARAM_ACTION_PLAN_CATEGORY_VERSION = "@ActionPlanCategoryVersion";
        #endregion
    }
}

