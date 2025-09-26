using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_MeetingDevelopment : P_ConnectionString, I_MeetingDevelopment
    {
        public DataSet getMeetingDevByMeetingCode(string meetingCode)
        {
            DataSet dtsMeetingDev = null;
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
                        dtsMeetingDev = new DataSet();
                        sqlcomm.CommandText = SQL_MeetingDeveploment.SP_GET_MEETING_DEV_BY_MEETING_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsMeetingDev, "MeetingDevelopment");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsMeetingDev = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsMeetingDev.Tables.Add(dt);
                    dtsMeetingDev.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsMeetingDev = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsMeetingDev.Tables.Add(dt);
                    dtsMeetingDev.Tables[0].TableName = "Error";
                }
            }
            return dtsMeetingDev;
        }

        public string insertMeetingDev(E_MeetingDevelopment entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_MeetingDeveploment.SP_INSERT_MEETING_DEV, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_MeetingDeveploment.PARAM_MEETING_DEV_CODE, SqlDbType.VarChar).Value = entity.MeetingDevCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;

                    command.Parameters.Add(SQL_MeetingDeveploment.PARAM_MEETING_DEV_DESCRIPTION, SqlDbType.VarChar).Value = 
                        entity.MeetingDevDescription == null ? (object)DBNull.Value : entity.MeetingDevDescription;

                    command.Parameters.Add(SQL_MeetingDeveploment.PARAM_MEETING_DEV_TITLE, SqlDbType.VarChar).Value =
                        entity.MeetingDevTitle == null ? (object)DBNull.Value : entity.MeetingDevTitle;

                    command.Parameters.Add(SQL_MeetingDeveploment.PARAM_MEETING_DEV_IMAGE, SqlDbType.VarChar).Value = 
                        entity.MeetingDevImage == null ? (object)DBNull.Value : entity.MeetingDevImage;

                    command.Parameters.Add(SQL_MeetingDeveploment.PARAM_MEETING_DEV_EXT_IMAGE, SqlDbType.VarChar).Value =
                        entity.MeetingDevImage == null ? (object)DBNull.Value : entity.MeetingDevExtImage;

                    command.Parameters.Add(SQL_MeetingDeveploment.PARAM_MEETING_DEV_NAME_IMAGE, SqlDbType.VarChar).Value =
                        entity.MeetingDevImage == null ? (object)DBNull.Value : entity.MeetingDevNameImage;

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