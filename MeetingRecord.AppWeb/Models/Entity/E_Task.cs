using System.Collections.Generic;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_Task
    {
        public int TaskId           { get; set; }
        public string What          { get; set; }
        public string ScheduledDate { get; set; }
        public string Responsible   { get; set; }
        public string UserCode      { get; set; }
        public string UserRegister  { get; set; }
        public string ExecutedDate  { get; set; }
        public string Observation   { get; set; }
        public string ExecutedBy    { get; set; }
        public List<E_TaskFile> Files   { get; set; }
    }
}