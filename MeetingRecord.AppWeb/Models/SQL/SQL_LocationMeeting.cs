namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_LocationMeeting
    {
        #region Stored Procedure        
        public const string SP_GET_ALL_LOCATION_MEETING = "SP_GetAllLocationMeeting";
        public const string SP_INSERT_LOCATION_MEETING = "SP_InsertLocationMeeting";
        public const string SP_UPDATE_LOCATION_MEETING = "SP_UpdateLocationMeeting";
        public const string SP_DELETE_LOCATION_MEETING = "SP_DeleteLocationMeeting";
        public const string SP_GET_ALL_LOCATION_MEETING_ACTIVE = "SP_GetAllLocationMeetingActive"; // @AMENDEZ5

        #endregion

        #region Parameters
        public const string PARAM_LOCATION_CODE = "@LocationCode";
        public const string PARAM_REGISTERED_BY_USER_ID = "@RegisteredByUserId";
        public const string PARAM_LOCATION_NAME = "@LocationName";
        public const string PARAM_LOCATION_STATUS = "@LocationStatus";
        public const string PARAM_LOCATION_VERSION = "@LocationVersion";
        public const string PARAM_AREA_ID = "@AreaId";
        #endregion
    }
}
