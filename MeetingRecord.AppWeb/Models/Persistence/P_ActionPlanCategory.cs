using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;
using MeetingRecord.AppWeb.Models.Interfaces;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_ActionPlanCategory : P_ConnectionString
    {
        public DataSet getAllActionPlanCategory()
        {
            DataSet dtsActionPlanCategory = null;
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
                        dtsActionPlanCategory = new DataSet();
                        sqlcomm.CommandText = SQL_ActionPlanCategory.SP_GET_ALL_ACTION_PLAN_CATEGORY;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsActionPlanCategory, "ActionPlanCategory");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsActionPlanCategory = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsActionPlanCategory.Tables.Add(dt);
                    dtsActionPlanCategory.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsActionPlanCategory = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsActionPlanCategory.Tables.Add(dt);
                    dtsActionPlanCategory.Tables[0].TableName = "Error";
                }
            }
            return dtsActionPlanCategory;
        }

        public string insertActionPlanCategory(E_ActionPlanCategory entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlanCategory.SP_INSERT_ACTION_PLAN_CATEGORY, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_ACTION_PLAN_CATEGORY_NAME, SqlDbType.VarChar).Value = entity.ActionPlanCategoryName;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_ACTION_PLAN_CATEGORY_STATUS, SqlDbType.Bit).Value = entity.ActionPlanCategoryStatus;
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

        public string updateActionPlanCategory(E_ActionPlanCategory entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlanCategory.SP_UPDATE_ACTION_PLAN_CATEGORY, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = entity.ActionPlanCategoryId;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_ACTION_PLAN_CATEGORY_NAME, SqlDbType.VarChar).Value = entity.ActionPlanCategoryName;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_ACTION_PLAN_CATEGORY_STATUS, SqlDbType.Bit).Value = entity.ActionPlanCategoryStatus;
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

        public string deleteActionPlanCategory(int actionPlanCategoryId)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_ActionPlanCategory.SP_DELETE_ACTION_PLAN_CATEGORY, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_ActionPlanCategory.PARAM_ACTION_PLAN_CATEGORY_ID, SqlDbType.Int).Value = actionPlanCategoryId;
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

        public List<E_ActionPlanCategory> getAllActionPlanCategoryActive()
        {
            var list = new List<E_ActionPlanCategory>();
            using (var connection = new SqlConnection(ConnectionString))
            using (var command = new SqlCommand(SQL_ActionPlanCategory.SP_GET_ALL_ACTION_PLAN_CATEGORY_ACTIVE, connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new E_ActionPlanCategory
                        {
                            ActionPlanCategoryId = Convert.ToInt32(reader["ActionPlanCategoryId"]),
                            ActionPlanCategoryName = reader["ActionPlanCategoryName"].ToString()
                        });
                    }
                }
            }
            return list;
        }
    }
}
