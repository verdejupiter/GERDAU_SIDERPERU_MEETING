using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_UserAssistance : P_ConnectionString, I_UserAssistance
    {
        public DataSet getUserAssistanceByMeetingCode(string meetingCode)
        {
            DataSet dtsUserAssistance = null;
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
                        dtsUserAssistance = new DataSet();
                        sqlcomm.CommandText = SQL_UserAssistance.SP_GET_USER_ASSISTANCE_BY_MEETING_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsUserAssistance, "UserAssistance");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsUserAssistance = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsUserAssistance.Tables.Add(dt);
                    dtsUserAssistance.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsUserAssistance = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsUserAssistance.Tables.Add(dt);
                    dtsUserAssistance.Tables[0].TableName = "Error";
                }
            }
            return dtsUserAssistance;
        }

        public string insertUserAssistance(E_UserAssistance entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_UserAssistance.SP_INSERT_USER_ASSISTANCE, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_CODE, SqlDbType.VarChar).Value = entity.UserAssistanceCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;
                    command.Parameters.Add(SQL_User.PARAM_USER_ID, SqlDbType.Int).Value = entity.UserId == 0 ? (object)DBNull.Value : entity.UserId;

                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_GUEST, SqlDbType.VarChar).Value = 
                        entity.UserAssistanceGuest == null ? (object)DBNull.Value : entity.UserAssistanceGuest;

                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_GUEST_DESC, SqlDbType.VarChar).Value =
                        entity.UserAssistanceGuestDesc == null ? (object)DBNull.Value : entity.UserAssistanceGuestDesc;

                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_GUEST_EMAIL, SqlDbType.VarChar).Value =
                        entity.UserAssistanceGuestEmail == null ? (object)DBNull.Value : entity.UserAssistanceGuestEmail;

                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_STATUS, SqlDbType.Bit).Value = entity.UserAssistanceStatus;
                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_JUSTIFICATION, SqlDbType.Bit).Value = entity.UserAssistanceJustification;

                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_REASON_JUSTIFICATION, SqlDbType.VarChar).Value =
                        entity.UserAssistanceReasonJustification == null ? (object)DBNull.Value : entity.UserAssistanceReasonJustification;

                    command.Parameters.Add(SQL_UserAssistance.PARAM_USER_ASSISTANCE_DELAY, SqlDbType.Bit).Value = entity.UserAssistanceDelay; // @AMENDEZ5

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