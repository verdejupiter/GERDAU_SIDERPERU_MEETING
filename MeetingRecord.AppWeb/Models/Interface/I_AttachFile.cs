using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interface
{
    interface I_AttachFile
    {
        DataSet getAttachFileByMeetingCode(string meetingCode);
        string insertAttachFile(E_AttachFile entity);
        string deleteAttachFile(string attachFileCode);
    }
}
