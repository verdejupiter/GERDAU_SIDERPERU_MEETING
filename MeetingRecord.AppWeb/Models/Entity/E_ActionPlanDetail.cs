using System;
using System.Web;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_ActionPlanDetail : E_ActionPlan
    {
        public string ActionPlanDetailCode              { get; set; }
        public HttpPostedFileBase ActionPlanDetailFile  { get; set; }
        public string ActionPlanDetailPathFile          { get; set; }
        public string ActionPlanDetailNameFile          { get; set; }
        public string ActionPlanDetailExtFile           { get; set; }
        public string ActionPlanDetailCaptionFile       { get; set; }
        public DateTime ActionPlanDetailVersion         { get; set; }
    }
}