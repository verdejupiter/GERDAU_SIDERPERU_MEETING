using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_Guide : P_ConnectionString, I_Guide
    {
        public DataSet getGuideByMeetingCode(string meetingCode)
        {
            DataSet dtsGuide = null;
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
                        dtsGuide = new DataSet();
                        sqlcomm.CommandText = SQL_Guide.SP_GET_GUIDE_BY_MEETING_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsGuide, "Guide");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsGuide = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsGuide.Tables.Add(dt);
                    dtsGuide.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsGuide = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsGuide.Tables.Add(dt);
                    dtsGuide.Tables[0].TableName = "Error";
                }
            }
            return dtsGuide;
        }

        public string insertGuide(E_Guide entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_Guide.SP_INSERT_GUIDE, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_Guide.PARAM_GUIDE_CODE, SqlDbType.VarChar).Value = entity.GuideCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;
                    command.Parameters.Add(SQL_Guide.PARAM_GUIDE_DESCRIPTION, SqlDbType.VarChar).Value = entity.GuideDescription;
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