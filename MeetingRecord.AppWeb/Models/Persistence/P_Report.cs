using MeetingRecord.AppWeb.Models.Interface;
using MeetingRecord.AppWeb.Models.SQL;
using System;
using System.Data;
using System.Data.SqlClient;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_Report : P_ConnectionString, I_Report
    {
        public DataSet GetReportMeetingUserAssistanceByArgs(string typeMeetingCode, int areaId, int cellId, int year, int month)
        {
            DataSet dts = null;
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
                        dts = new DataSet();
                        sqlcomm.CommandText = SQL_Report.SP_GET_REPORT_MEETING_USER_ASSISTANCE_BY_ARGS;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_AREA_ID, SqlDbType.Int).Value               = areaId;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_CELL_ID, SqlDbType.Int).Value               = cellId;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_YEAR, SqlDbType.Int).Value                  = year;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_MONTH, SqlDbType.Int).Value                 = month;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "Report");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dts = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dts.Tables.Add(dt);
                    dts.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dts = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dts.Tables.Add(dt);
                    dts.Tables[0].TableName = "Error";
                }
            }
            return dts;
        }

        public DataSet GetReportDetailMeetingUserAssistanceByArgs(string typeMeetingCode, int areaId, int cellId, int year, int month)
        {
            DataSet dts = null;
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
                        dts = new DataSet();
                        sqlcomm.CommandText = SQL_Report.SP_GET_REPORT_DETAIL_MEETING_USER_ASSISTANCE_BY_ARGS;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_CELL_ID, SqlDbType.Int).Value = cellId;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_YEAR, SqlDbType.Int).Value = year;
                        sqlcomm.Parameters.Add(SQL_Report.PARAM_MONTH, SqlDbType.Int).Value = month;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts);
                        dts.Tables[0].TableName = "Report";
                        dts.Tables[1].TableName = "InfoReport";
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dts = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dts.Tables.Add(dt);
                    dts.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dts = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dts.Tables.Add(dt);
                    dts.Tables[0].TableName = "Error";
                }
            }
            return dts;
        }
    }
}