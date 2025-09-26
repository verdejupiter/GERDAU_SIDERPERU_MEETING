using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_UserAssistance
    {
        string insertUserAssistance(E_UserAssistance entity);
        DataSet getUserAssistanceByMeetingCode(string meetingCode);
    }
}
