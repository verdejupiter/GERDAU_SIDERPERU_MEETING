using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_Guide
    {
        string insertGuide(E_Guide entity);
        DataSet getGuideByMeetingCode(string meetingCode);
    }
}
