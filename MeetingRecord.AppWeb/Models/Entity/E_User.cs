namespace MeetingRecord.AppWeb.Models.Entity
{
    public class E_User
    {
        public int UserId               { get; set; }
        public string UserName          { get; set; }
        public bool UserStatus          { get; set; }
        public string UserNetName       { get; set; }
        public string UserPassword      { get; set; }
        public int UserRole             { get; set; }
        public int RegisteredByUserId   { get; set; }
        public int UpdatedByUserId      { get; set; }
    }
}