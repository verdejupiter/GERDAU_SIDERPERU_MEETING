using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_ActionPlanDetail
    {
        string insertActionPlanDetail(E_ActionPlanDetail entity);
        DataSet getActionPlanDetailByActionPlanCode(string actionPlanCode);

        string deleteActionPlanDetail(E_ActionPlanDetail entity); //@AMENDEZ5
    }
}
