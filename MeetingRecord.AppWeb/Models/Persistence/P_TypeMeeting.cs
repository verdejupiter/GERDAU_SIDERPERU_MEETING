using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_TypeMeeting : P_ConnectionString, I_TypeMeeting
    {
        public DataSet getAllTypeMeeting(int areaId, int cellId)
        {
            DataSet dtsTypeMeeting = null;
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
                        dtsTypeMeeting = new DataSet();
                        sqlcomm.CommandText = SQL_TypeMeeting.SP_GET_ALL_TYPE_MEETING;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //21/8
                        sqlcomm.Parameters.AddWithValue("@AreaId", areaId);
                        sqlcomm.Parameters.AddWithValue("@CellId", cellId);

                        sqldt.Fill(dtsTypeMeeting, "TypeMeeting");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsTypeMeeting = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsTypeMeeting.Tables.Add(dt);
                    dtsTypeMeeting.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsTypeMeeting = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsTypeMeeting.Tables.Add(dt);
                    dtsTypeMeeting.Tables[0].TableName = "Error";
                }
            }
            return dtsTypeMeeting;
        }

        public string insertTypeMeeting(E_TypeMeeting entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_TypeMeeting.SP_INSERT_TYPE_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = entity.TypeMeetingCode;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_DESCRIPTION, SqlDbType.VarChar).Value = entity.TypeMeetingDescription;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_STATUS, SqlDbType.Bit).Value = entity.TypeMeetingStatus;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_SCHEDULED_DAYS, SqlDbType.VarChar).Value = entity.TypeMeetingScheduledDays; //@AMENDEZ5
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_FREQUENCY, SqlDbType.VarChar).Value = entity.TypeMeetingFrequency; //@AMENDEZ5
                    //16/08
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = entity.AreaId;
                    //16/08
                    //21/08
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_CELL_ID, SqlDbType.Int).Value = entity.CellId;
                    //21/08
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

        public string updateTypeMeeting(E_TypeMeeting entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_TypeMeeting.SP_UPDATE_TYPE_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = entity.TypeMeetingCode;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_DESCRIPTION, SqlDbType.VarChar).Value = entity.TypeMeetingDescription;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_SCHEDULED_DAYS, SqlDbType.VarChar).Value = entity.TypeMeetingScheduledDays; //@AMENDEZ5
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_FREQUENCY, SqlDbType.VarChar).Value = entity.TypeMeetingFrequency; //@AMENDEZ5
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_STATUS, SqlDbType.Bit).Value = entity.TypeMeetingStatus;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_VERSION, SqlDbType.DateTime).Value = entity.TypeMeetingVersion;
                    //16/08
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = entity.AreaId;
                    //16/08
                    //21/08
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_CELL_ID, SqlDbType.Int).Value = entity.CellId;
                    //21/08
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

        public string deleteTypeMeeting(string typeMeetingCode)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_TypeMeeting.SP_DELETE_TYPE_MEETING, connection);
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

        public List<E_TypeMeeting> getAllTypeMeetingActive(int areaId)
        {
            var list = new List<E_TypeMeeting>();
            using (var connection = new SqlConnection(ConnectionString))
            using (var command = new SqlCommand(SQL_TypeMeeting.SP_GET_ALL_TYPE_MEETING_ACTIVE, connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(SQL_LocationMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;

                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new E_TypeMeeting
                        {
                            TypeMeetingCode = reader["TypeMeetingCode"].ToString(),
                            TypeMeetingDescription = reader["TypeMeetingDescription"].ToString()
                        });
                    }
                }
            }
            return list;
        } //@AMENDEZ5 

        //21/8
        public List<E_TypeMeeting> getTypeMeetingByArea(int areaId, int? cellId)
        {
            var list = new List<E_TypeMeeting>();
            using (var connection = new SqlConnection(ConnectionString))
            using (var command = new SqlCommand(SQL_TypeMeeting.SP_GET_TYPE_MEETING_BY_AREA, connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(SQL_LocationMeeting.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                //21/8
                command.Parameters.Add("@CellId", SqlDbType.Int).Value = (object)cellId ?? DBNull.Value;

                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var entity = new E_TypeMeeting
                        {
                            TypeMeetingCode = reader["TypeMeetingCode"].ToString(),
                            TypeMeetingDescription = reader["TypeMeetingDescription"].ToString(),
                            TypeMeetingStatus = reader["TypeMeetingStatus"] != DBNull.Value && Convert.ToBoolean(reader["TypeMeetingStatus"]),
                            TypeMeetingFrequency = reader["TypeMeetingFrequency"]?.ToString(),
                            TypeMeetingScheduledDays = reader["TypeMeetingScheduledDays"]?.ToString(),
                            //21/8
                            AreaId = reader["AreaId"] != DBNull.Value ? Convert.ToInt32(reader["AreaId"]) : 0,
                            CellId = reader["CellId"] != DBNull.Value ? Convert.ToInt32(reader["CellId"]) : 0


                        };
                        list.Add(entity);
                    }
                }
            }
            return list;
        }


    }
}