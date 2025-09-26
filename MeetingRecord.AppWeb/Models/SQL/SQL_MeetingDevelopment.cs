namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_MeetingDeveploment
    {
        #region Stored Procedure
        public const string SP_GET_MEETING_DEV_BY_MEETING_CODE  = "SP_GetMeetingDevByMeetingCode";
        public const string SP_INSERT_MEETING_DEV               = "SP_InsertMeetingDev";
        #endregion

        #region Parameters
        public const string PARAM_MEETING_DEV_CODE        = "@MeetingDevCode";
		public const string PARAM_MEETING_DEV_DESCRIPTION = "@MeetingDevDescription";
		public const string PARAM_MEETING_DEV_TITLE       = "@MeetingDevTitle";
		public const string PARAM_MEETING_DEV_IMAGE       = "@MeetingDevImage";
		public const string PARAM_MEETING_DEV_EXT_IMAGE   = "@MeetingDevExtImage";
		public const string PARAM_MEETING_DEV_NAME_IMAGE  = "@MeetingDevNameImage";
        public const string PARAM_MEETING_DEV_VERSION     = "@MeetingDevVersion";
        #endregion
    }
}