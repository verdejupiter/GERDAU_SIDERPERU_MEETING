using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_User : P_ConnectionString, I_User
    {
        public DataSet getUserByUserName(string userName, string selectedUserIds)
        {
            DataSet dtsUser = null;
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
                        dtsUser = new DataSet();
                        sqlcomm.CommandText = SQL_User.SP_GET_USER_BY_USER_NAME;
                        sqlcomm.Parameters.Add(SQL_User.PARAM_USER_NAME, SqlDbType.VarChar).Value = userName;
                        sqlcomm.Parameters.Add(SQL_User.PARAM_SELECTED_USER_IDS, SqlDbType.VarChar).Value = selectedUserIds;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsUser, "User");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsUser = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsUser.Tables.Add(dt);
                    dtsUser.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsUser = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsUser.Tables.Add(dt);
                    dtsUser.Tables[0].TableName = "Error";
                }
            }
            return dtsUser;
        }

        public DataSet getUserInfoByUserNetName(string userNetName)
        {
            DataSet dtsUser = null;
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
                        dtsUser = new DataSet();
                        sqlcomm.CommandText = SQL_User.SP_GET_USER_BY_USER_NET_NAME;
                        sqlcomm.Parameters.Add(SQL_User.PARAM_USER_NET_NAME, SqlDbType.VarChar).Value = userNetName;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsUser, "User");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsUser = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsUser.Tables.Add(dt);
                    dtsUser.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsUser = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsUser.Tables.Add(dt);
                    dtsUser.Tables[0].TableName = "Error";
                }
            }
            return dtsUser;
        }

        public DataSet getAllMEUser()
        {
            DataSet dtsUser = null;
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
                        dtsUser = new DataSet();
                        sqlcomm.CommandText = SQL_User.SP_GET_ALL_ME_USER;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsUser, "User");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsUser = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsUser.Tables.Add(dt);
                    dtsUser.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsUser = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsUser.Tables.Add(dt);
                    dtsUser.Tables[0].TableName = "Error";
                }
            }
            return dtsUser;
        }

        public string insertMEUser(E_User entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_User.SP_INSERT_ME_USER, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_User.PARAM_USER_ID, SqlDbType.Int).Value = entity.UserId;
                    command.Parameters.Add(SQL_User.PARAM_USER_ROLE, SqlDbType.Int).Value = entity.UserRole;
                    command.Parameters.Add(SQL_User.PARAM_USER_STATUS, SqlDbType.Bit).Value = entity.UserStatus;
                    command.Parameters.Add(SQL_User.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
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

        public string updateMEUser(E_User entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_User.SP_UPDATE_ME_USER, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_User.PARAM_USER_ID, SqlDbType.Int).Value = entity.UserId;
                    command.Parameters.Add(SQL_User.PARAM_USER_ROLE, SqlDbType.Int).Value = entity.UserRole;
                    command.Parameters.Add(SQL_User.PARAM_USER_STATUS, SqlDbType.Bit).Value = entity.UserStatus;
                    command.Parameters.Add(SQL_User.PARAM_UPDATED_BY_USER_ID, SqlDbType.Int).Value = entity.UpdatedByUserId;
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

        public string deleteMEUser(int userId)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_User.SP_DELETE_ME_USER, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_User.PARAM_USER_ID, SqlDbType.Int).Value = userId;
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