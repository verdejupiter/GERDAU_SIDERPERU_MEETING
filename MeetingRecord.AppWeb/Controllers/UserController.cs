using System;
using System.Web.Mvc;
using System.Security;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using System.Runtime.ConstrainedExecution;
using Newtonsoft.Json;
using System.Data;
using MeetingRecord.AppWeb.Models.Persistence;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Controllers
{
    public class UserController : Controller
    {
        public ActionResult Index()
        {
            if (Session.Count > 0)
            {
                int userRole = Convert.ToInt16(Session["UserRole"]);
                if (userRole == 1 || userRole == 2) //@AMENDEZ5
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        public JsonResult getUserByUserName(string userName, string selectedUserIds)
        {
            string json;
            var persintence = new P_User();
            DataSet dtsUser = persintence.getUserByUserName(userName, selectedUserIds);
            if (dtsUser.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsUser.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
                return Json(json, JsonRequestBehavior.AllowGet);
            }
            json = JsonConvert.SerializeObject(dtsUser, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getUserByLoginAD(E_User entity)
        {
            E_Message messageEntity = new E_Message();
            DataSet dtsMessage;
            DataSet dataSet = null;

            SafeTokenHandle safeTokenHandle;
            string domainName = "gerdau.net";
            const int LOGON32_PROVIDER_DEFAULT = 0;
            const int LOGON32_PROVIDER_WINNT50 = 3;

            //bool returnValue = LogonUser(entity.UserNetName, domainName, entity.UserPassword,
            //    LOGON32_PROVIDER_WINNT50, LOGON32_PROVIDER_DEFAULT,
            //    out safeTokenHandle);

            // Develop
            bool returnValue = true;

            if (returnValue)
            {
                var persintence = new P_User();
                DataSet dtsUser = persintence.getUserInfoByUserNetName(entity.UserNetName);
                if (dtsUser.Tables[0].Rows.Count > 0)
                {
                    if (dtsUser.Tables[0].TableName == "Error")
                    {
                        string messageError = dtsUser.Tables["Error"].Rows[0]["message"].ToString();
                        dtsMessage = messageEntity.getDtsMessage(messageError);
                        dataSet = dtsMessage;
                    }
                    else
                    {
                        dataSet = dtsUser;
                        int userId          = int.Parse(dtsUser.Tables[0].Rows[0]["UserId"].ToString());
                        string userNetName  = dtsUser.Tables[0].Rows[0]["UserNetName"].ToString();
                        //int userRole        = int.Parse(dtsUser.Tables[0].Rows[0]["UserRol"].ToString());
                        int userRole = int.Parse(dtsUser.Tables[0].Rows[0]["UserRole"].ToString()); //ANTES
                        Session["UserId"]       = userId;
                        Session["UserNetName"]  = userNetName;
                        //Session["UserRole"]     = userRole; //ANTES
                        Session["UserRole"]     = userRole;
                    }
                }
            }
            else
            {
                dtsMessage = messageEntity.getDtsMessage("Error de autentificación en el Active Directory");
                dataSet = dtsMessage;
            }
            string json = JsonConvert.SerializeObject(dataSet, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getUserByUserNetName(string userNetName)
        {
            string json;
            var persintence = new P_User();
            DataSet dtsUser = persintence.getUserInfoByUserNetName(userNetName);
            if (dtsUser.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsUser.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
                return Json(json, JsonRequestBehavior.AllowGet);
            }
            int userId      = int.Parse(dtsUser.Tables[0].Rows[0]["UserId"].ToString());
            int userRole    = int.Parse(dtsUser.Tables[0].Rows[0]["UserRole"].ToString());
            Session["UserId"]       = userId;
            Session["UserNetName"]  = userNetName;
            Session["UserRole"]  = userRole;
            json = JsonConvert.SerializeObject(dtsUser, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getAllMEUser()
        {
            string json;
            var persintence = new P_User();
            DataSet dtsUser = persintence.getAllMEUser();
            if (dtsUser.Tables[0].TableName == "Error")
            {
                E_Message messageEntity = new E_Message();
                string messageError = dtsUser.Tables["Error"].Rows[0]["message"].ToString();
                DataSet dtsMessage = messageEntity.getDtsMessage(messageError);
                json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
                return Json(json, JsonRequestBehavior.AllowGet);
            }
            json = JsonConvert.SerializeObject(dtsUser, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertMEUser(E_User entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_User();
            string message = persistence.insertMEUser(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult updateMEUser(E_User entity)
        {
            var messageEntity = new E_Message();
            var persistence = new P_User();
            string message = persistence.updateMEUser(entity);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public JsonResult deleteMEUser(int userId)
        {
            var messageEntity = new E_Message();
            var persistence = new P_User();
            string message = persistence.deleteMEUser(userId);
            DataSet dtsMessage = messageEntity.getDtsMessage(message);
            string json = JsonConvert.SerializeObject(dtsMessage, Formatting.Indented);
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public sealed class SafeTokenHandle : SafeHandleZeroOrMinusOneIsInvalid
        {
            private SafeTokenHandle(): base(true) {}

            [DllImport("kernel32.dll")]
            [ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
            [SuppressUnmanagedCodeSecurity]
            [return: MarshalAs(UnmanagedType.Bool)]
            private static extern bool CloseHandle(IntPtr handle);
            protected override bool ReleaseHandle() {return CloseHandle(handle);}
        }

        [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern bool LogonUser(String lpszUsername, String lpszDomain, String lpszPassword,
            int dwLogonType, int dwLogonProvider, out SafeTokenHandle phToken);


    }
}