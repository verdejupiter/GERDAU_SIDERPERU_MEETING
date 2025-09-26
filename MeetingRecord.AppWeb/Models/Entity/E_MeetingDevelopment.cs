using System;
using System.Web;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_MeetingDevelopment : E_Meeting
    {
        public string MeetingDevCode                    { get; set; }
        public string MeetingDevDescription             { get; set; }
        public string MeetingDevTitle                   { get; set; }
        public HttpPostedFileBase MeetingDevFileImage   { get; set; }
        public string MeetingDevImage                   { get; set; }
        public string MeetingDevExtImage                { get; set; }
        public string MeetingDevNameImage               { get; set; }
        public DateTime MeetingDevVersion               { get; set; }
    }
}