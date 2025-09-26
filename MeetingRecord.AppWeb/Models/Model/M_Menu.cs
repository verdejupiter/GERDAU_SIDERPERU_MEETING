using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MeetingRecord.AppWeb.Models.Model
{
    public class M_Menu
    {
        public string MenuId          { get; set; }
        public string MenuName        { get; set; }
        public string MenuUrl         { get; set; }
        public string MenuActive      { get; set; }
        public string MenuClass       { get; set; }
        public string MenuIcon        { get; set; }
        public List<M_Menu> MenuChild { get; set; }
    }
}