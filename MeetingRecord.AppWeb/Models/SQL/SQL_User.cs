namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_User
    {
        #region Stored Procedure     
        public const string SP_GET_USER_BY_USER_NET_NAME    = "SP_GetUserByUserNetName";
        public const string SP_GET_USER_BY_USER_NAME        = "SP_GetUserByUserName";
        public const string SP_GET_ALL_ME_USER              = "SP_GetAllMEUser";
        public const string SP_INSERT_ME_USER               = "SP_InsertMEUser";
        public const string SP_UPDATE_ME_USER               = "SP_UpdateMEUser";
        public const string SP_DELETE_ME_USER               = "SP_DeleteMEUser";
        #endregion

        #region Parameters
        public const string PARAM_USER_ID               = "@UserId";
        public const string PARAM_USER_NAME             = "@UserName";
        public const string PARAM_USER_NET_NAME         = "@UserNetName";
        public const string PARAM_USER_ROLE             = "@UserRole";
        public const string PARAM_USER_STATUS           = "@UserStatus";
        public const string PARAM_REGISTERED_BY_USER_ID = "@RegisteredByUserId";
        public const string PARAM_UPDATED_BY_USER_ID    = "@UpdatedByUserId";

        public const string PARAM_SELECTED_USER_IDS     = "@SelectedUserIds";
        #endregion
    }
}