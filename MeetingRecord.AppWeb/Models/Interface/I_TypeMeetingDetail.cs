using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_TypeMeetingDetail
    {
        DataSet getTypeMeetingDetailByCode(string typeMeetingCode);
        string insertTypeMeetingDetail(string typeMeetingCode, int userId);
        string deleteTypeMeetingDetail(string typeMeetingCode);
    }
}
