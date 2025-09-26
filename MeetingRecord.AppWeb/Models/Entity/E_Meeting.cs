using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_Meeting
    {
        public string MeetingCode        { get; set; }
        public string TypeMeetingCode    { get; set; }
        public int AreaId                { get; set; }
        public int CellId                { get; set; }
        public int RegisteredByUserId    { get; set; }
        public int UpdatedByUserId       { get; set; }
        public int DeletedByUserId       { get; set; }
        public string MeetingSubject     { get; set; }

        //public string MeetingLocation    { get; set; } //ANTES
        public string LocationCode { get; set; }  //@AMENDEZ5
        public string MeetingDate        { get; set; }
        public string MeetingStartTime   { get; set; }
        public string MeetingEndTime     { get; set; }
        public bool MeetingStatus        { get; set; }
        public string MeetingVersion     { get; set; }
    }

    public class E_Area
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }
    }

}