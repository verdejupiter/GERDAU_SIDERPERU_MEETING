using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;
using System.Data.Common;
using System.Collections.Generic;
using System.Web.Mvc;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    /// <summary>
    /// Persistencia de plan de acción. |
    /// Author:      Jean Carlos Sánchez Castromonte |
    /// Update date: 20/11/2019
    /// </summary>
    public class P_ActionPlan : P_ConnectionString, I_ActionPlan, I_ApiActionPlan
    {
        public DataSet getActionPlanByMeetingCode(string meetingCode)
        {
            DataSet dtsActionPlan = null;
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
                        dtsActionPlan = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlan.SP_GET_ACTION_PLAN_BY_MEETING_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        }

        public DataSet getActionPlanPendingByArgs(
            int responsibleUserId,
            string meetingCode = "0",
            string typeMeetingCode = "0",
            int areaId = 0,
            string startDate = null,
            string endDate = null,
            int userId = 0,
            string description = "0",
            int actionPlanStatus = 0,
            string actionPlanPriority = "0",
            bool mineScope = false,
            int actionPlanCategoryId = 0,
            string dateFilterType = "scheduled")
        {
            DataSet dtsActionPlan = null;
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                try
                {
                    sqlConn.Open();
                    using (SqlDataAdapter sqldt = new SqlDataAdapter())
                    {
                        dtsActionPlan = new DataSet();
                        SqlCommand sqlcomm = new SqlCommand(SQL_ActionPlan.SP_GET_ACTION_PLAN_PENDING_BY_ARGS, sqlConn);
                        sqlcomm.CommandType = CommandType.StoredProcedure;

                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = responsibleUserId;
                        sqlcomm.Parameters.Add("@MeetingCode", SqlDbType.VarChar, 100).Value = meetingCode;
                        sqlcomm.Parameters.Add("@TypeMeetingCode", SqlDbType.VarChar, 100).Value = typeMeetingCode;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_START_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : startDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_END_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : endDate;
                        sqlcomm.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                        sqlcomm.Parameters.Add("@Description", SqlDbType.VarChar, 100).Value = description;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = actionPlanStatus;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_PRIORITY, SqlDbType.VarChar, 50).Value = actionPlanPriority;
                        sqlcomm.Parameters.Add("@MineScope", SqlDbType.Bit).Value = mineScope;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = actionPlanCategoryId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_DATE_FILTER_TYPE, SqlDbType.VarChar, 20).Value = dateFilterType;

                        sqldt.SelectCommand = sqlcomm;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        }

        public DataSet getActionPlanExecutedByArgs(
            int responsibleUserId,
            string startDate,
            string endDate,
            string meetingCode = "0",
            string typeMeetingCode = "0",
            int areaId = 0,
            int userId = 0,
            string description = "0",
            bool mineScope = false,
            int actionPlanCategoryId = 0,
            string actionPlanPriority = "0",
            int actionPlanStatus = 0,
            string dateFilterType = "executed")
        {
            DataSet dtsActionPlan = null;
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                try
                {
                    sqlConn.Open();
                    using (SqlDataAdapter sqldt = new SqlDataAdapter())
                    {
                        dtsActionPlan = new DataSet();
                        SqlCommand sqlcomm = new SqlCommand(SQL_ActionPlan.SP_GET_ACTION_PLAN_EXECUTED_BY_ARGS, sqlConn);
                        sqlcomm.CommandType = CommandType.StoredProcedure;

                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = responsibleUserId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_START_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : startDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_END_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : endDate;
                        sqlcomm.Parameters.Add("@MeetingCode", SqlDbType.VarChar, 100).Value = meetingCode;
                        sqlcomm.Parameters.Add("@TypeMeetingCode", SqlDbType.VarChar, 100).Value = typeMeetingCode;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                        sqlcomm.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                        sqlcomm.Parameters.Add("@Description", SqlDbType.VarChar, 100).Value = description;
                        sqlcomm.Parameters.Add("@MineScope", SqlDbType.Bit).Value = mineScope;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = actionPlanCategoryId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_PRIORITY, SqlDbType.VarChar, 50).Value = actionPlanPriority;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = actionPlanStatus;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_DATE_FILTER_TYPE, SqlDbType.VarChar, 20).Value = dateFilterType;

                        sqldt.SelectCommand = sqlcomm;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        }

        public DataSet getActionPlanByUserId(int responsibleUserId)
        {
            DataSet dtsActionPlan = null;
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
                        dtsActionPlan = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlan.SP_GET_ACTION_PLAN_BY_USER_ID;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = responsibleUserId;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        }

        /*public DataSet getActionPlanExecutedByArgs(int responsibleUserId, string startDate, string endDate)
        {
            DataSet dtsActionPlan = null;
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
                        dtsActionPlan = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlan.SP_GET_ACTION_PLAN_EXECUTED_BY_ARGS;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = responsibleUserId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_START_DATE, SqlDbType.Date).Value = startDate;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_END_DATE, SqlDbType.Date).Value = endDate;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        }*/

        /*public DataSet getAllActionPlanCategory()
        {
            DataSet dts = null;
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                try
                {
                    sqlConn.Open();
                    using (SqlDataAdapter sqldt = new SqlDataAdapter())
                    {
                        dts = new DataSet();
                        SqlCommand sqlcomm = new SqlCommand(SQL_ActionPlan.SP_GET_ALL_ACTION_PLAN_CATEGORY, sqlConn);
                        sqlcomm.CommandType = CommandType.StoredProcedure;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.Fill(dts, "ActionPlanCategory");
                    }
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
            }
            return dts;
        }*/ //@AMENDEZ5

        public string insertActionPlan(E_ActionPlan entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlan.SP_INSERT_ACTION_PLAN, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = entity.ActionPlanCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_WHAT, SqlDbType.VarChar).Value = entity.ActionPlanWhat;
                    //command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_WHY, SqlDbType.VarChar).Value = entity.ActionPlanWhy;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = entity.ResponsibleUserId;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_SCHEDULED_DATE, SqlDbType.Date).Value = entity.ActionPlanScheduledDate;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = entity.ActionPlanStatus; //@AMENDEZ5
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_PRIORITY, SqlDbType.VarChar).Value = entity.ActionPlanPriority; //@AMENDEZ5
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = entity.ActionPlanCategoryId; //@AMENDEZ5

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

        public string updateActionPlan(E_ActionPlan entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlan.SP_UPDATE_ACTION_PLAN, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = entity.ActionPlanCode;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_WHAT, SqlDbType.VarChar).Value = entity.ActionPlanWhat;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = entity.ResponsibleUserId;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_SCHEDULED_DATE, SqlDbType.Date).Value = entity.ActionPlanScheduledDate;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = entity.ActionPlanStatus;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_PRIORITY, SqlDbType.VarChar).Value = entity.ActionPlanPriority;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = entity.ActionPlanCategoryId;

                    command.ExecuteNonQuery();
                    message = "Success";
                }
            }
            catch (SqlException ex)
            {
                message = "SQL Error: " + ex.Message;
            }
            return message;
        } //@AMENDEZ5

        public string deleteActionPlan(string actionPlanCode)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("SP_DeleteActionPlan", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add("@ActionPlanCode", SqlDbType.VarChar).Value = actionPlanCode;
                    command.ExecuteNonQuery();
                    message = "Success";
                }
            }
            catch (SqlException ex)
            {
                message = "SQL Error: " + ex.Message;
            }
            return message;
        } //@AMENDEZ5

        public string executeActionPlan(E_ActionPlan entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlan.SP_EXECUTE_ACTION_PLAN, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = entity.ActionPlanCode;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_EXECUTED_DESC, SqlDbType.VarChar).Value = entity.ActionPlanExecutedDesc;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_EXECUTED_DATE, SqlDbType.Date).Value = entity.ActionPlanExecutedDate;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = entity.ActionPlanStatus;
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

        public DataSet getActionPlanByCode(string actionPlanCode)
        {
            DataSet dtsActionPlan = null;
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                try
                {
                    sqlConn.Open();
                    using (SqlDataAdapter sqldt = new SqlDataAdapter())
                    {
                        dtsActionPlan = new DataSet();
                        SqlCommand sqlcomm = new SqlCommand(SQL_ActionPlan.SP_GET_ACTION_PLAN_BY_CODE, sqlConn);
                        sqlcomm.CommandType = CommandType.StoredProcedure;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = actionPlanCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        }

        public string updateActionPlanComments(E_ActionPlan entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlan.SP_UPDATE_ACTION_PLAN_COMMENTS, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CODE, SqlDbType.VarChar).Value = entity.ActionPlanCode;
                    command.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_EXECUTED_DESC, SqlDbType.VarChar).Value = entity.ActionPlanExecutedDesc;
                    command.ExecuteNonQuery();
                    connection.Close();
                    message = "Success";
                }
            }
            catch (SqlException ex)
            {
                message = "SQL Error: " + ex.Message;
            }
            catch (Exception e)
            {
                message = "Error: " + e.Message;
            }
            return message;
        } //@AMENDEZ5

        public DataSet TaskGet(E_TaskFilter taskFilter)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_TASK_GET;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_USER_CODE, SqlDbType.VarChar).Value  = taskFilter.UserCode;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_START_DATE, SqlDbType.Date).Value    = taskFilter.StartDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_END_DATE, SqlDbType.Date).Value      = taskFilter.EndDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_AREA_ID, SqlDbType.Int).Value        = taskFilter.AreaId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_CELL_ID, SqlDbType.Int).Value        = taskFilter.CellId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TYPE, SqlDbType.Int).Value           = taskFilter.Type;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "TASK_GET");
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
            }
            return dts;
        }

        public DataSet TaskClose(E_Task task)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_TASK_CLOSE;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_ID, SqlDbType.Int).Value = task.TaskId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_EXECUTED_DATE, SqlDbType.Date).Value = task.ExecutedDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_OBSERVATION, SqlDbType.VarChar).Value = task.Observation;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_EXECUTED_BY, SqlDbType.VarChar).Value = task.ExecutedBy;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "TASK_CLOSE");
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
            }
            return dts;
        }

        public DataSet TaskDelete(E_Task task)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_TASK_DELETE;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_ID, SqlDbType.Int).Value = task.TaskId;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "TASK_DELETE");
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
            }
            return dts;
        }

        public DataSet TaskUpdate(E_Task task)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_TASK_UPDATE;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_ID, SqlDbType.Int).Value = task.TaskId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_WHAT, SqlDbType.VarChar).Value = task.What;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_SCHEDULED_DATE, SqlDbType.Date).Value = task.ScheduledDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_RESPONSIBLE, SqlDbType.VarChar).Value = task.Responsible;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_USER_REGISTER, SqlDbType.VarChar).Value = task.UserRegister;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "TASK_UPDATE");
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
            }
            return dts;
        }

        public DataSet AnnexedInsert(DataTable taskTable)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_ANNEXED_INSERT;
                        sqlcomm.Parameters.AddWithValue(SQL_ActionPlan.PARAM_TASK_TABLE, taskTable);                        
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "ANNEXED_INSERT");
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
            }
            return dts;
        }

        public DataSet AnnexedGet(int taskId)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_ANNEXED_GET;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_TASK_ID, SqlDbType.Int).Value = taskId;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "ANNEXED_GET");
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
            }
            return dts;
        }

        public DataSet TaskGetCountByResponsible(string userCode)
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
                        sqlcomm.CommandText = SQL_ActionPlan.SP_TASK_GET_COUNT_BY_RESPONSIBLE;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_USER_CODE, SqlDbType.VarChar).Value = userCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dts, "TASK_GETCOUNTBYRESPONSIBLE");
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
            }
            return dts;
        }

        public DataSet getActionPlanPendingExportToExcel(
    int responsibleUserId,
    string meetingCode,
    string startDate,
    string endDate,
    int userId,
    bool mineScope,
    int actionPlanStatus,
    string actionPlanPriority,
    int actionPlanCategoryId,
    string dateFilterType)
        {
            DataSet dtsActionPlan = null;
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
                        dtsActionPlan = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlan.SP_GET_ACTION_PLAN_PENDING_EXPORT_TO_EXCEL;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = responsibleUserId;
                        sqlcomm.Parameters.Add("@MeetingCode", SqlDbType.VarChar, 100).Value = meetingCode;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_START_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : startDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_END_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : endDate;
                        sqlcomm.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                        sqlcomm.Parameters.Add("@MineScope", SqlDbType.Bit).Value = mineScope;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = actionPlanStatus;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_PRIORITY, SqlDbType.VarChar, 50).Value = actionPlanPriority;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = actionPlanCategoryId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_DATE_FILTER_TYPE, SqlDbType.VarChar, 20).Value = dateFilterType;

                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        } //@AMENDEZ5

        public DataSet getActionPlanExecutedExportToExcel(
            int responsibleUserId,
            string meetingCode,
            string startDate,
            string endDate,
            int userId,
            bool mineScope,
            int actionPlanStatus,
            string actionPlanPriority,
            int actionPlanCategoryId,
            string dateFilterType)
        {
            DataSet dtsActionPlan = null;
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
                        dtsActionPlan = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlan.SP_GET_ACTION_PLAN_EXECUTED_EXPORT_TO_EXCEL;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_RESPONSIBLE_USER_ID, SqlDbType.Int).Value = responsibleUserId;
                        sqlcomm.Parameters.Add("@MeetingCode", SqlDbType.VarChar, 100).Value = meetingCode;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_START_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(startDate) ? (object)DBNull.Value : startDate;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_END_DATE, SqlDbType.Date).Value = string.IsNullOrEmpty(endDate) ? (object)DBNull.Value : endDate;
                        sqlcomm.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;
                        sqlcomm.Parameters.Add("@MineScope", SqlDbType.Bit).Value = mineScope;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_STATUS, SqlDbType.Int).Value = actionPlanStatus;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_PRIORITY, SqlDbType.VarChar, 50).Value = actionPlanPriority;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = actionPlanCategoryId;
                        sqlcomm.Parameters.Add(SQL_ActionPlan.PARAM_DATE_FILTER_TYPE, SqlDbType.VarChar, 20).Value = dateFilterType;

                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlan, "ActionPlan");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlan = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlan.Tables.Add(dt);
                    dtsActionPlan.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlan;
        } //@AMENDEZ5

    }
}