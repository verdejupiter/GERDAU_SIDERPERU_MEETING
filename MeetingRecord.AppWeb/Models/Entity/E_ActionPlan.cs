
using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_ActionPlan : E_Meeting
    {
        public string ActionPlanCode            { get; set; }
        public int ActionPlanId                 { get; set; }
        public string ActionPlanWhat            { get; set; }
        public string ActionPlanWhy             { get; set; }
        public int ResponsibleUserId            { get; set; }
        public DateTime ActionPlanScheduledDate { get; set; }
        public string ActionPlanExecutedDesc    { get; set; }
        public DateTime ActionPlanExecutedDate  { get; set; }
        public int ActionPlanStatus             { get; set; }
        public DateTime ActionPlanVersion       { get; set; }
        public string ActionPlanPriority        { get; set; } //@AMENDEZ5
        public int ActionPlanCategoryId         { get; set; } //@AMENDEZ5

    }
}