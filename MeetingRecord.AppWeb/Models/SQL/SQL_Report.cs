namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_Report
    {
        #region Stored Procedure
        public const string SP_GET_REPORT_MEETING_USER_ASSISTANCE_BY_ARGS           = "SP_GetReportMeetingUserAssistanceByArgs";
        public const string SP_GET_REPORT_DETAIL_MEETING_USER_ASSISTANCE_BY_ARGS    = "SP_GetReportDetailMeetingUserAssistanceByArgs";
        #endregion

        #region Parameters
        public const string PARAM_TYPE_MEETING_CODE = "@TypeMeetingCode";
        public const string PARAM_AREA_ID           = "@AreaId";
        public const string PARAM_CELL_ID           = "@CellId";
        public const string PARAM_YEAR              = "@Year";
        public const string PARAM_MONTH             = "@Month";
        #endregion
    }
}