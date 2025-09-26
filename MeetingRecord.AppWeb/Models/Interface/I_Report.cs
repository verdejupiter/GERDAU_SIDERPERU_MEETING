using System.Data;

namespace MeetingRecord.AppWeb.Models.Interface
{
    interface I_Report
    {
        DataSet GetReportMeetingUserAssistanceByArgs(string typeMeetingCode, int areaId, int cellId, int year, int month);
        DataSet GetReportDetailMeetingUserAssistanceByArgs(string typeMeetingCode, int areaId, int cellId, int year, int month);
    }
}
