using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_LocationMeeting
    {
        public string LocationCode { get; set; }

        public int RegisteredByUserId { get; set; }

        public string LocationName { get; set; }

        public bool LocationStatus { get; set; }

        public DateTime LocationVersion { get; set; }

        public int AreaId { get; set; } 
    }
}
