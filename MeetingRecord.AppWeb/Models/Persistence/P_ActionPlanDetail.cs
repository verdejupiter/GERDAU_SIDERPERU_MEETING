using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_ActionPlanDetail : P_ConnectionString, I_ActionPlanDetail
    {
        public DataSet getActionPlanDetailByActionPlanCode(string actionPlanCode)
        {
            DataSet dtsActionPlanDetail = null;
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
                        dtsActionPlanDetail = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlanDetail.SP_GET_ACTION_PLAN_DETAIL_BY_AP_CODE;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = actionPlanCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlanDetail, "ActionPlanDetail");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlanDetail = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlanDetail.Tables.Add(dt);
                    dtsActionPlanDetail.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlanDetail = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlanDetail.Tables.Add(dt);
                    dtsActionPlanDetail.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlanDetail;
        }

        public string insertActionPlanDetail(E_ActionPlanDetail entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlanDetail.SP_INSERT_ACTION_PLAN_DETAIL, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = entity.ActionPlanCode;
                    command.Parameters.Add(SQL_ActionPlanDetail.PARAM_ACTION_PLAN_DETAIL_CODE, SqlDbType.VarChar).Value = entity.ActionPlanDetailCode;
                    command.Parameters.Add(SQL_ActionPlanDetail.PARAM_ACTION_PLAN_DETAIL_PATH_FILE, SqlDbType.VarChar).Value = entity.ActionPlanDetailPathFile;
                    command.Parameters.Add(SQL_ActionPlanDetail.PARAM_ACTION_PLAN_DETAIL_NAME_FILE, SqlDbType.VarChar).Value = entity.ActionPlanDetailNameFile;
                    command.Parameters.Add(SQL_ActionPlanDetail.PARAM_ACTION_PLAN_DETAIL_EXT_FILE, SqlDbType.VarChar).Value = entity.ActionPlanDetailExtFile;
                    command.Parameters.Add(SQL_ActionPlanDetail.PARAM_ACTION_PLAN_DETAIL_CAPTION_FILE, SqlDbType.VarChar).Value = entity.ActionPlanDetailCaptionFile;
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

        public string deleteActionPlanDetail(E_ActionPlanDetail entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlanDetail.SP_DELETE_ACTION_PLAN_DETAIL, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlanDetail.PARAM_ACTION_PLAN_DETAIL_CODE, SqlDbType.VarChar).Value = entity.ActionPlanDetailCode;
                    command.ExecuteNonQuery();
                    connection.Close();
                    message = "Success";
                }
            }
            catch (SqlException ex)
            {
                message = "SQL Error: " + ex.Message;
            }
            return message;
        } //@AMENDEZ5

    }
}