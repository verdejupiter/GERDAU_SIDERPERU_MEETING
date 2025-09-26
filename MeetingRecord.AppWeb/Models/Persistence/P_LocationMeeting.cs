using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_LocationMeeting : P_ConnectionString
    {
        //21/8
        public DataSet getAllLocationMeeting(int areaId)
        {
            DataSet dtsLocationMeeting = null;
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
                        dtsLocationMeeting = new DataSet();
                        sqlcomm.CommandText = SQL_LocationMeeting.SP_GET_ALL_LOCATION_MEETING;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //21/8
                        sqlcomm.Parameters.AddWithValue("@AreaId", areaId);

                        sqldt.Fill(dtsLocationMeeting, "LocationMeeting");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsLocationMeeting = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsLocationMeeting.Tables.Add(dt);
                    dtsLocationMeeting.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsLocationMeeting = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsLocationMeeting.Tables.Add(dt);
                    dtsLocationMeeting.Tables[0].TableName = "Error";
                }
            }
            return dtsLocationMeeting;
        }

        public string insertLocationMeeting(E_LocationMeeting entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_LocationMeeting.SP_INSERT_LOCATION_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_CODE, SqlDbType.VarChar).Value = entity.LocationCode;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_NAME, SqlDbType.VarChar).Value = entity.LocationName;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_STATUS, SqlDbType.Bit).Value = entity.LocationStatus;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = entity.AreaId;
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

        public string updateLocationMeeting(E_LocationMeeting entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_LocationMeeting.SP_UPDATE_LOCATION_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_CODE, SqlDbType.VarChar).Value = entity.LocationCode;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_NAME, SqlDbType.VarChar).Value = entity.LocationName;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_STATUS, SqlDbType.Bit).Value = entity.LocationStatus;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = entity.AreaId;
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

        public string deleteLocationMeeting(string locationCode)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_LocationMeeting.SP_DELETE_LOCATION_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_LocationMeeting.PARAM_LOCATION_CODE, SqlDbType.VarChar).Value = locationCode;
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

        //16/8
        public List<E_LocationMeeting> getAllLocationMeetingActive(int areaId)
        {
            var list = new List<E_LocationMeeting>();
            using (var connection = new SqlConnection(ConnectionString))
            using (var command = new SqlCommand(SQL_LocationMeeting.SP_GET_ALL_LOCATION_MEETING_ACTIVE, connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(SQL_LocationMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new E_LocationMeeting
                        {
                            LocationCode = reader["LocationCode"].ToString(),
                            LocationName = reader["LocationName"].ToString()
                        });
                    }
                }
            }
            return list;
        } //@AMENDEZ5
        //16/8

    }
}
