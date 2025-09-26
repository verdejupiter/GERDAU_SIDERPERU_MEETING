using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_ActionPlanCategory
    {
        DataSet getAllActionPlanCategory();

        string insertActionPlanCategory(E_ActionPlanCategory entity);

        string updateActionPlanCategory(E_ActionPlanCategory entity);

        string deleteActionPlanCategory(int actionPlanCategoryId);

        List<E_ActionPlanCategory> getAllActionPlanCategoryActive();
    }
}
