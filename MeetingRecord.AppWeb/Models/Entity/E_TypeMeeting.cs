using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_TypeMeeting
    {
        public string TypeMeetingCode{ get; set; }
        public int RegisteredByUserId { get; set; }
        public string TypeMeetingDescription { get; set; }
        public bool TypeMeetingStatus { get; set; }
        public DateTime TypeMeetingVersion { get; set; }
        public string TypeMeetingScheduledDays { get; set; } //@AMENDEZ5
        public string TypeMeetingFrequency { get; set; } //@AMENDEZ5
        
        // 16/08
        public int AreaId { get; set; }
        // 16/08

        //21/08
        public int CellId { get; set; }
        //21/08

    }
}