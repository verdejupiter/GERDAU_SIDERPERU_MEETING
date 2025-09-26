using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_TypeMeeting
    {

        // 21/08
        DataSet getAllTypeMeeting(int areaId, int cellId);
        // 21/08

        string insertTypeMeeting(E_TypeMeeting entity);
        string updateTypeMeeting(E_TypeMeeting entity);
        string deleteTypeMeeting(string typeMeetingCode);
        // 21/08
        List<E_TypeMeeting> getAllTypeMeetingActive(int areaId);//@AMENDEZ5

        // 21/08
        List<E_TypeMeeting> getTypeMeetingByArea(int areaId, int? cellId);
        // 21/08

    }
}
