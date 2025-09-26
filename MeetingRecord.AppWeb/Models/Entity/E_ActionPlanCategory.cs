using System;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_ActionPlanCategory
    {
        public int ActionPlanCategoryId { get; set; }

        public string ActionPlanCategoryName { get; set; }

        public int RegisteredByUserId { get; set; }

        public bool ActionPlanCategoryStatus { get; set; }

        public DateTime ActionPlanCategoryVersion { get; set; }
    }
}
