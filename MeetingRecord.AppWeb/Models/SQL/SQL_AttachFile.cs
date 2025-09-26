namespace MeetingRecord.AppWeb.Models.SQL
{
    public class SQL_AttachFile
    {
        #region Stored Procedure
        public const string SP_GET_ATTACH_FILE_BY_MEETING_CODE      = "SP_GetAttachFileByMeetingCode";
        public const string SP_INSERT_ATTACH_FILE                   = "SP_InsertAttachFile";
        public const string SP_DELETE_ATTACH_FILE                   = "SP_DeleteAttachFile";
        #endregion

        #region Parameters
        public const string PARAM_ATTACH_FILE_CODE                  = "@AttachFileCode";
        public const string PARAM_ATTACH_FILE_NAME                  = "@AttachFileName";
        public const string PARAM_ATTACH_FILE_EXT                   = "@AttachFileExtension";
        public const string PARAM_ATTACH_FILE_TITLE                 = "@AttachFileTitle";
        public const string PARAM_ATTACH_FILE_PATH                  = "@AttachFilePath";
        public const string PARAM_ATTACH_FILE_REGISTERED_BY_USER_ID = "@AttachFileRegisteredByUserId";
        #endregion
    }
}