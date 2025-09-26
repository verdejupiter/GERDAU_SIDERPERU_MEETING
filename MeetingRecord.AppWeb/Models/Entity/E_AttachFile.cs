using System.Web;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_AttachFile
    {
        public string AttachFileCode { get; set; }
        public string MeetingCode { get; set; }
        public string AttachFileName { get; set; }
        public string AttachFileExtension { get; set; }
        public string AttachFileTitle { get; set; }
        public string AttachFilePath { get; set; }
        public int AttachFileRegisteredByUserId { get; set; }
        public HttpPostedFileBase AttachFileBase { get; set; }
    }
}