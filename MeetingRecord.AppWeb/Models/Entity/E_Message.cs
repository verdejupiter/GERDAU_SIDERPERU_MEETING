using System.Data;

namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_Message
    {
        public DataSet getDtsMessage(string message)
        {
            DataSet dtsMessage = new DataSet();
            DataTable dt = new DataTable("Message");
            dt.Columns.Add(new DataColumn("Description", typeof(string)));
            dt.Rows.Add(message);
            dtsMessage.Tables.Add(dt);
            return dtsMessage;
        }
    }
}