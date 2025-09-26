using MeetingRecord.AppWeb.Models.Entity;
using System.Data;

namespace MeetingRecord.AppWeb.Models.Interfaces
{
    interface I_User
    {
        DataSet getUserByUserName(string userName, string selectedUserIds);
        DataSet getUserInfoByUserNetName(string userNetName);
        DataSet getAllMEUser();
        string insertMEUser(E_User entity);
        string updateMEUser(E_User entity);
        string deleteMEUser(int userId);
    }
}
