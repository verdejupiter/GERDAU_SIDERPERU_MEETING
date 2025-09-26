using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    /// <summary>
    /// Interface de api plan de acción. |
    /// Author:      Jean Carlos Sánchez Castromonte |
    /// Update date: 20/11/2019
    /// </summary>
    interface I_ApiActionPlan
    {
        DataSet TaskGet(E_TaskFilter taskFilter);
        DataSet TaskClose(E_Task task);
        DataSet TaskDelete(E_Task task);
        DataSet TaskUpdate(E_Task task);
        DataSet AnnexedInsert(DataTable taskTable);
        DataSet AnnexedGet(int taskId);
        DataSet TaskGetCountByResponsible(string userCode);
    }
}
