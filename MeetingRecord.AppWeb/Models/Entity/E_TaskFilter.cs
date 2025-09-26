namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_TaskFilter
    {
        public string UserCode  { get; set; }
        public string StartDate { get; set; }
        public string EndDate   { get; set; }
        public int AreaId       { get; set; }
        public int CellId       { get; set; }
        public int Type         { get; set; }
    }
}