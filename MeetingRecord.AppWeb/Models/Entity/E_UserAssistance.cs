namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_UserAssistance : E_Meeting
    {
        public string UserAssistanceCode        { get; set; }
        public int UserId                       { get; set; }
        public string UserAssistanceGuest       { get; set; }
        public string UserAssistanceGuestDesc   { get; set; }
        public string UserAssistanceGuestEmail  { get; set; }
        public bool UserAssistanceStatus        { get; set; }
        public bool UserAssistanceJustification { get; set; }
        public string UserAssistanceReasonJustification { get; set; }
        public string UserAssistanceVersion     { get; set; }
        public bool UserAssistanceDelay         { get; set; } // @AMENDEZ5
    }
}