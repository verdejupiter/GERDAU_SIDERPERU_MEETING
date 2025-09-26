using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_LocationMeeting
    {
        //21/8
        DataSet getAllLocationMeeting(int areaId);
        //21/8

        string insertLocationMeeting(E_LocationMeeting entity);

        string updateLocationMeeting(E_LocationMeeting entity);

        string deleteLocationMeeting(string LocationCode);

        //16/08
        List<E_LocationMeeting> getAllLocationMeetingActive(int areaId); //@AMENDEZ5
        //16/08

    }
}
