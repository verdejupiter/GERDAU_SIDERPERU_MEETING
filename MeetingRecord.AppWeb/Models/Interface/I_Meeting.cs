using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_Meeting
    {
        DataSet getMeetingByArgs(int meetingId, int areaId, int cellId, string typeMeetingCode, string startDate, string endDate, int userId, string description, bool mineScope, string meetingCode, int creatorUserId); //@AMENDEZ5
        DataSet getMeetingByArgsExportToExcel(int meetingId, int areaId, int cellId, string typeMeetingCode, string startDate, string endDate, int userId, string description, string meetingCode, bool mineScope, int creatorUserId); //@AMENDEZ5       
        DataSet getMeetingByCode(string meetingCode);
        string insertMeeting(E_Meeting entity);
        string updateMeeting(E_Meeting entity);
        string deleteMeeting(string meetingCode, int deletedByUserId);
        string deleteAllMeetingDetail(string meetingCode);
        string sendEmailPDFMeetingByParticipants(string meetingCode, string fileNamePDF);
        string generateNewMeetingCode(); //@AMENDEZ5
        List<E_Area> getAllArea(); //@AMENDEZ5
        DataTable GetMeetingCodeByText(string meetingCode); //@AMENDEZ5
        DataSet getAttachFileByMeetingCode(string meetingCode);//@AMENDEZ5
    }
}
