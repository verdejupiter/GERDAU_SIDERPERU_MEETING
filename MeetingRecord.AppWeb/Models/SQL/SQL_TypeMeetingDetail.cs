namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_TypeMeetingDetail
    {
        #region Stored Procedure        
        public const string SP_GET_TYPE_MEETING_DETAIL_BY_CODE  = "SP_GetTypeMeetingDetailByCode";
        public const string SP_INSERT_TYPE_MEETING_DETAIL       = "SP_InsertTypeMeetingDetail";
        public const string SP_DELETE_TYPE_MEETING_DETAIL       = "SP_DeleteTypeMeetingDetail";
        #endregion

        #region Parameters
        public const string PARAM_TYPE_MEETING_CODE             = "@TypeMeetingCode";
        public const string PARAM_USER_ID                       = "@UserId";
        public const string PARAM_TYPE_MEETING_DETAIL_VERSION   = "@TypeMeetingDetailVersion";
        #endregion
    }
}