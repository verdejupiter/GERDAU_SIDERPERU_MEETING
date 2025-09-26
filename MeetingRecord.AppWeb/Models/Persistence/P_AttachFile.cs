using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Entity;
using MeetingRecord.AppWeb.Models.Interface;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_AttachFile : P_ConnectionString, I_AttachFile
    {
        public DataSet getAttachFileByMeetingCode(string meetingCode)
        {
            DataSet dtsAttachFile = null;
            SqlConnection sqlConn = new SqlConnection(ConnectionString);
            SqlCommand sqlcomm = new SqlCommand();
            sqlcomm.Connection = sqlConn;
            using (sqlConn)
            {
                try
                {
                    sqlConn.Open();
                    using (SqlDataAdapter sqldt = new SqlDataAdapter())
                    {
                        dtsAttachFile = new DataSet();
                        sqlcomm.CommandText = SQL_AttachFile.SP_GET_ATTACH_FILE_BY_MEETING_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsAttachFile, "AttachFile");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsAttachFile = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsAttachFile.Tables.Add(dt);
                    dtsAttachFile.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsAttachFile = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsAttachFile.Tables.Add(dt);
                    dtsAttachFile.Tables[0].TableName = "Error";
                }
            }
            return dtsAttachFile;
        }

        public string insertAttachFile(E_AttachFile entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_AttachFile.SP_INSERT_ATTACH_FILE, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_CODE, SqlDbType.VarChar).Value = entity.AttachFileCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_NAME, SqlDbType.VarChar).Value = entity.AttachFileName;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_EXT, SqlDbType.VarChar).Value = entity.AttachFileExtension;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_TITLE, SqlDbType.VarChar).Value = entity.AttachFileTitle;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_PATH, SqlDbType.VarChar).Value = entity.AttachFilePath;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.AttachFileRegisteredByUserId;
                    command.ExecuteReader(CommandBehavior.SingleResult);
                    connection.Close();
                    message = "Success";
                }
            }
            catch (SqlException ex)
            {
                message = "SQL Error: " + ex.Message;
            }
            return message;
        }

        public string deleteAttachFile(string attachFileCode)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_AttachFile.SP_DELETE_ATTACH_FILE, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_AttachFile.PARAM_ATTACH_FILE_CODE, SqlDbType.VarChar).Value = attachFileCode;
                    command.ExecuteReader(CommandBehavior.SingleResult);
                    connection.Close();
                    message = "Success";
                }
            }
            catch (SqlException ex)
            {
                message = "SQL Error: " + ex.Message;
            }
            return message;
        }
    }
}