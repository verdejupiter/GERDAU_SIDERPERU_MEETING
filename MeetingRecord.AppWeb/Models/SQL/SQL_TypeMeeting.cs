namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_TypeMeeting
    {
        #region Stored Procedure        
        public const string SP_GET_ALL_TYPE_MEETING         = "SP_GetAllTypeMeeting";
        public const string SP_INSERT_TYPE_MEETING          = "SP_InsertTypeMeeting";
        public const string SP_UPDATE_TYPE_MEETING          = "SP_UpdateTypeMeeting";
        public const string SP_DELETE_TYPE_MEETING          = "SP_DeleteTypeMeeting";
        public const string SP_GET_ALL_TYPE_MEETING_ACTIVE  = "SP_GetAllTypeMeetingActive"; // @AMENDEZ5
        //16/8
        public const string SP_GET_TYPE_MEETING_BY_AREA     = "SP_GetTypeMeetingByArea";
        #endregion

        #region Parameters
        public const string PARAM_TYPE_MEETING_CODE             = "@TypeMeetingCode";
        public const string PARAM_REGISTERED_BY_USER_ID         = "@RegisteredByUserId";
        public const string PARAM_TYPE_MEETING_DESCRIPTION      = "@TypeMeetingDescription";
        public const string PARAM_TYPE_MEETING_STATUS           = "@TypeMeetingStatus";
        public const string PARAM_TYPE_MEETING_VERSION          = "@TypeMeetingVersion";
        public const string PARAM_TYPE_MEETING_SCHEDULED_DAYS   = "@TypeMeetingScheduledDays"; //@AMENDEZ5
        public const string PARAM_TYPE_MEETING_FREQUENCY        = "@TypeMeetingFrequency"; //@AMENDEZ5
        //16/08
        public const string PARAM_AREA_ID = "@AreaId";
        //16/08
        //21/08
        public const string PARAM_CELL_ID = "@CellId";
        //21/08
        #endregion
    }
}