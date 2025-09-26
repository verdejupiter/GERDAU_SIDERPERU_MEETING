using System.Data;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_MeetingDevelopment
    {
        DataSet getMeetingDevByMeetingCode(string meetingCode);
        string insertMeetingDev(E_MeetingDevelopment entity);
    }
}
