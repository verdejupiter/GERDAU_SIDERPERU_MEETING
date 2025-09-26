using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_Guide : E_Meeting
    {
        public string GuideCode              { get; set; }
        public string GuideDescription  { get; set; }
        public DateTime GuideVersion    { get; set; }
    }
}