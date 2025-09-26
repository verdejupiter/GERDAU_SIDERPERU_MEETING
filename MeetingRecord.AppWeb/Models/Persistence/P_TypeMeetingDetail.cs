using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_TypeMeetingDetail : P_ConnectionString, I_TypeMeetingDetail
    {
        public DataSet getTypeMeetingDetailByCode(string typeMeetingCode)
        {
            DataSet dtsTypeMeetingDetail = null;
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
                        dtsTypeMeetingDetail = new DataSet();
                        sqlcomm.CommandText = SQL_TypeMeetingDetail.SP_GET_TYPE_MEETING_DETAIL_BY_CODE;
                        sqlcomm.Parameters.Add(SQL_TypeMeetingDetail.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsTypeMeetingDetail, "TypeMeetingDetail");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsTypeMeetingDetail = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsTypeMeetingDetail.Tables.Add(dt);
                    dtsTypeMeetingDetail.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsTypeMeetingDetail = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsTypeMeetingDetail.Tables.Add(dt);
                    dtsTypeMeetingDetail.Tables[0].TableName = "Error";
                }
            }
            return dtsTypeMeetingDetail;
        }

        public string insertTypeMeetingDetail(string typeMeetingCode, int userId)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_TypeMeetingDetail.SP_INSERT_TYPE_MEETING_DETAIL, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_TypeMeetingDetail.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
                    command.Parameters.Add(SQL_TypeMeetingDetail.PARAM_USER_ID, SqlDbType.Int).Value = userId;
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


        public string deleteTypeMeetingDetail(string typeMeetingCode)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_TypeMeetingDetail.SP_DELETE_TYPE_MEETING_DETAIL, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
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