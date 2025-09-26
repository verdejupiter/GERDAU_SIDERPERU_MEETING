using System.Data;

namespace MeetingRecord.AppWeb.Models.Model
{
    public class M_Meeting
    {
        public DataSet dtsMeeting { get; set; }
        public DataSet dtsGuide { get; set; }
        public DataSet dtsUserAssistance { get; set; }
        public DataSet dtsMeetingDev { get; set; }
        public DataSet dtsActionPlan { get; set; }
        public DataSet dtsAttachFile { get; set; } //@AMENDEZ5
    }
}