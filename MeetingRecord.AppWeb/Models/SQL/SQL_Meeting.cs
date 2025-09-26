namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_Meeting
    {
        #region Stored Procedure
        public const string SP_GET_MEETING_BY_ARGS                      = "SP_GetMeetingByArgs";
        public const string SP_GET_MEETING_BY_ARGS_EXPORT_TO_EXCEL      = "SP_GetMeetingByArgsExportToExcel";
        public const string SP_GET_MEETING_BY_CODE                      = "SP_GetMeetingByCode";
        public const string SP_INSERT_MEETING                           = "SP_InsertMeeting";
        public const string SP_UPDATE_MEETING                           = "SP_UpdateMeeting";
        public const string SP_DELETE_MEETING                           = "SP_DeleteMeeting";
        public const string SP_DELETE_ALL_MEETING_DETAIL                = "SP_DeleteAllMeetingDetail";
        public const string SP_SEND_EMAIL_PDF_MEETING_BY_PARTICIPANTS   = "SP_SendEmailPDFMeetingByParticipants";
        public const string SP_GET_NEW_MEETING_CODE                     = "SP_GetNewMeetingCode"; // @AMENDEZ5
        public const string SP_GET_ALL_AREA                             = "SP_GetAllArea"; // @AMENDEZ5
        public const string SP_GET_MEETING_CODE_BY_TEXT                 = "SP_GetMeetingCodeByText"; //@AMENDEZ5
        public const string SP_GET_ATTACH_FILE_BY_MEETING_CODE          = "SP_GetAttachFileByMeetingCode"; //@AMENDEZ5
        #endregion

        #region Parameters
        public const string PARAM_MEETING_CODE           = "@MeetingCode";
        public const string PARAM_MEETING_ID             = "@MeetingId";
        public const string PARAM_AREA_ID                = "@AreaId";
        public const string PARAM_CELL_ID                = "@CellId";
        public const string PARAM_REGISTERED_BY_USER_ID  = "@RegisteredByUserId";
        public const string PARAM_UPDATED_BY_USER_ID     = "@UpdatedByUserId";
        public const string PARAM_DELETED_BY_USER_ID     = "@DeletedByUserId";
        public const string PARAM_MEETING_SUBJECT        = "@MeetingSubject";
        //public const string PARAM_MEETING_LOCATION     = "@MeetingLocation"; //ANTES
        public const string PARAM_LOCATION_CODE          = "@LocationCode"; //@AMENDEZ5
        public const string PARAM_MEETING_DATE           = "@MeetingDate";
        public const string PARAM_MEETING_START_TIME     = "@MeetingStartTime";
        public const string PARAM_MEETING_END_TIME       = "@MeetingEndTime";
        public const string PARAM_MEETING_STATUS         = "@MeetingStatus";
        public const string PARAM_MEETING_VERSION        = "@MeetingVersion";        
        public const string PARAM_START_DATE             = "@StartDate";
        public const string PARAM_END_DATE               = "@EndDate";
        public const string PARAM_USER_ID                = "@UserId";
        public const string PARAM_FILE_NAME_PDF          = "@FileNamePDF";
        public const string PARAM_MEETING_DESCRIPTION    = "@MeetingDescription";
        public const string PARAM_MINE_SCOPE             = "@MineScope"; //@AMENDEZ5
        public const string PARAM_CATEGORY_CODE          = "@CategoryCode"; ///@AMENDEZ5
        public const string PARAM_CREATOR_USER_ID          = "@CreatorUserId"; ///@AMENDEZ5 4/08
        #endregion
    }
}