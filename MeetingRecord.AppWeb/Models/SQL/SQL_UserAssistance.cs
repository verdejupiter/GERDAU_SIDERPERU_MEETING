namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_UserAssistance
    {
        #region Stored Procedure     
        public const string SP_INSERT_USER_ASSISTANCE               = "SP_InsertUserAssistance";
        public const string SP_GET_USER_ASSISTANCE_BY_MEETING_CODE  = "SP_GetUserAssistanceByMeetingCode";
        #endregion

        #region Parameters
        public const string PARAM_USER_ASSISTANCE_CODE          = "@UserAssistanceCode";
        public const string PARAM_USER_ASSISTANCE_GUEST         = "@UserAssistanceGuest";
        public const string PARAM_USER_ASSISTANCE_GUEST_DESC    = "@UserAssistanceGuestDesc";
        public const string PARAM_USER_ASSISTANCE_GUEST_EMAIL   = "@UserAssistanceGuestEmail";
        public const string PARAM_USER_ASSISTANCE_STATUS        = "@UserAssistanceStatus";
        public const string PARAM_USER_ASSISTANCE_JUSTIFICATION = "@UserAssistanceJustification";
        public const string PARAM_USER_ASSISTANCE_REASON_JUSTIFICATION = "@UserAssistanceReasonJustification";
        public const string PARAM_USER_ASSISTANCE_VERSION       = "@UserAssistanceVersion";
        public const string PARAM_USER_ASSISTANCE_DELAY         = "@UserAssistanceDelay"; // @AMENDEZ5

        #endregion
    }
}