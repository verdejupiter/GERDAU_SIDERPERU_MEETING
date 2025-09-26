using ClosedXML.Excel;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Web;

namespace MeetingRecord.AppWeb.Helper.HelperFunction
{
    /// <summary>
    /// Libreria de funciones de ayuda. |
    /// Author:      Jean Carlos Sánchez Castromonte |
    /// Update date: 20/11/2019
    /// </summary>
    public static class HelperFunction
    {
        private static Random random = new Random();

        public static void ExportToExcel(System.Data.DataTable dt, string FileName)
        {
            if (dt.Rows.Count > 0)
            {
                if (HttpContext.Current.Response.RedirectLocation == null)
                {
                    string filename = FileName + ".xlsx";
                    XLWorkbook wb = new XLWorkbook();
                    var ws = wb.Worksheets.Add("Hoja1");
                    ws.Cell(2, 1).InsertTable(dt);
                    ws.Columns().AdjustToContents();
                    ws.Rows().AdjustToContents();
                    HttpContext.Current.Response.Buffer = true;
                    HttpContext.Current.Response.Charset = "";
                    HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + filename + "");
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        wb.SaveAs(memoryStream);
                        memoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
                        memoryStream.Close();
                    }
                    HttpContext.Current.Response.End();
                }
            }
        }

        public static string encryptCode(this string code)
        {
            string result = string.Empty;
            byte[] encryted = System.Text.Encoding.Unicode.GetBytes(code);
            result = Convert.ToBase64String(encryted);
            return result;
        }

        public static string decryptCode(this string code)
        {
            string result = string.Empty;
            byte[] decryted = Convert.FromBase64String(code);
            result = System.Text.Encoding.Unicode.GetString(decryted);
            return result;
        }

        public static string getLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }

        /// <summary>
        /// Convertir un Base64 a archivo y guardar en una ubicación. |
        /// Author:      Jean Carlos Sánchez Castromonte |
        /// Update date: 20/11/2019
        /// </summary>
        public static void SetFileFromBase64(string fileCode, string fileBase64, string fileExt, string filePath)
        {
            byte[] bytes = Convert.FromBase64String(fileBase64);
            string _filePath = HttpContext.Current.Server.MapPath("~/" + filePath);
            File.WriteAllBytes(_filePath, bytes);
        }

        /// <summary>
        /// Obtener base64 de un archivo según ubicación. |
        /// Author:      Jean Carlos Sánchez Castromonte |
        /// Update date: 20/11/2019
        /// </summary>
        public static string GetBase64FromFile(string filePath)
        {
            string _filePath = HttpContext.Current.Server.MapPath("~/" + filePath);
            byte[] bytes = File.ReadAllBytes(_filePath);
           return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// Generar codigo según tipo. |
        /// Author:      Jean Carlos Sánchez Castromonte |
        /// Update date: 20/11/2019
        /// </summary>
        public static string GenerateCode(string type)
        {
            string dateCode = DateTime.Now.ToString("yyyyMMddHHmmss");
            return type + "-" + dateCode + GetRandomString(3);
        }

        /// <summary>
        /// Obtener cadena aleatorio. |
        /// Author:      Jean Carlos Sánchez Castromonte |
        /// Update date: 20/11/2019
        /// </summary>
        public static string GetRandomString(int length)
        {

            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}