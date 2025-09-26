namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_Guide
    {
        #region Stored Procedure     
        public const string SP_INSERT_GUIDE                 = "SP_InsertGuide";
        public const string SP_GET_GUIDE_BY_MEETING_CODE    = "SP_GetGuideByMeetingCode";
        #endregion

        #region Parameters
        public const string PARAM_GUIDE_CODE        = "@GuideCode";
        public const string PARAM_GUIDE_DESCRIPTION = "@GuideDescription";
        public const string PARAM_GUIDE_VERSION     = "@GuideVersion";
        #endregion
    }
}