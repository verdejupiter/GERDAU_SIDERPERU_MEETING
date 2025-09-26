using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_TypeMeetingDetail : E_TypeMeeting
    {
        public int UserId                       { get; set; }
        public DateTime UserGroupDetailVersion  { get; set; }
    }
}