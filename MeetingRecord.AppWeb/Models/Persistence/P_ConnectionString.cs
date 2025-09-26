using System.Web.Configuration;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public abstract class P_ConnectionString
    {
        public string ConnectionString { get; set; }

        public P_ConnectionString() 
        {
            this.ConnectionString = WebConfigurationManager.ConnectionStrings["DB_MEETING"].ConnectionString;
        }

    }
}