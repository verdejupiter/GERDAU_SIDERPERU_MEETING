using System;
using MeetingRecord.AppWeb.Models.SQL;
using System.Data;
using System.Data.SqlClient;
using MeetingRecord.AppWeb.Models.Interfaces;
using MeetingRecord.AppWeb.Models.Entity;
using System.Collections.Generic;

namespace MeetingRecord.AppWeb.Models.Persistence
{
    public class P_Meeting : P_ConnectionString, I_Meeting
    {
        public DataSet getMeetingByArgs(int meetingId, int areaId, int cellId, 
            string typeMeetingCode, string startDate, string endDate, int userId, string description,
            bool mineScope, string meetingCode, int creatorUserId) //@AMENDEZ5
        {
            DataSet dtsMeeting = null;
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
                        dtsMeeting = new DataSet();
                        sqlcomm.CommandText = SQL_Meeting.SP_GET_MEETING_BY_ARGS;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_ID, SqlDbType.Int).Value = meetingId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_CELL_ID, SqlDbType.Int).Value = cellId;
                        sqlcomm.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_START_DATE, SqlDbType.Date).Value = startDate;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_END_DATE, SqlDbType.Date).Value = endDate;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_USER_ID, SqlDbType.Int).Value = userId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_DESCRIPTION, SqlDbType.VarChar).Value = description;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MINE_SCOPE, SqlDbType.Bit).Value = mineScope; //@AMENDEZ5
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode ?? ""; //@AMENDEZ5
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_CREATOR_USER_ID, SqlDbType.Int).Value = creatorUserId; //@AMENDEZ5 4/08
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsMeeting, "Meeting");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsMeeting = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsMeeting.Tables.Add(dt);
                    dtsMeeting.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsMeeting = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsMeeting.Tables.Add(dt);
                    dtsMeeting.Tables[0].TableName = "Error";
                }
            }
            return dtsMeeting;
        }

        public DataSet getMeetingByArgsExportToExcel(int meetingId, int areaId, int cellId, string typeMeetingCode, string startDate, string endDate, int userId, string description, string meetingCode, bool mineScope, int creatorUserId)
        {
            DataSet dtsMeeting = null;
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
                        dtsMeeting = new DataSet();
                        sqlcomm.CommandText = SQL_Meeting.SP_GET_MEETING_BY_ARGS_EXPORT_TO_EXCEL;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_ID, SqlDbType.Int).Value = meetingId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_AREA_ID, SqlDbType.Int).Value = areaId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_CELL_ID, SqlDbType.Int).Value = cellId;
                        sqlcomm.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = typeMeetingCode;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_START_DATE, SqlDbType.Date).Value = startDate;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_END_DATE, SqlDbType.Date).Value = endDate;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_USER_ID, SqlDbType.Int).Value = userId;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_DESCRIPTION, SqlDbType.VarChar).Value = description;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MINE_SCOPE, SqlDbType.Bit).Value = mineScope;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_CREATOR_USER_ID, SqlDbType.Int).Value = creatorUserId; //@AMENDEZ5 4/08

                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsMeeting, "Meeting");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsMeeting = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsMeeting.Tables.Add(dt);
                    dtsMeeting.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsMeeting = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsMeeting.Tables.Add(dt);
                    dtsMeeting.Tables[0].TableName = "Error";
                }
            }
            return dtsMeeting;
        }

        public DataSet getMeetingByCode(string meetingCode)
        {
            DataSet dtsMeeting = null;
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
                        dtsMeeting = new DataSet();
                        sqlcomm.CommandText = SQL_Meeting.SP_GET_MEETING_BY_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsMeeting, "Meeting");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsMeeting = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsMeeting.Tables.Add(dt);
                    dtsMeeting.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsMeeting = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsMeeting.Tables.Add(dt);
                    dtsMeeting.Tables[0].TableName = "Error";
                }
            }
            return dtsMeeting;
        }

        public string insertMeeting(E_Meeting entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_Meeting.SP_INSERT_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = entity.TypeMeetingCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_AREA_ID, SqlDbType.Int).Value = entity.AreaId;
                    command.Parameters.Add(SQL_Meeting.PARAM_CELL_ID, SqlDbType.Int).Value = entity.CellId;
                    command.Parameters.Add(SQL_Meeting.PARAM_REGISTERED_BY_USER_ID, SqlDbType.Int).Value = entity.RegisteredByUserId;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_SUBJECT, SqlDbType.VarChar).Value = entity.MeetingSubject;
                    command.Parameters.Add(SQL_Meeting.PARAM_LOCATION_CODE, SqlDbType.VarChar).Value = entity.LocationCode; //@AMENDEZ5
                    //command.Parameters.Add(SQL_Meeting.PARAM_MEETING_LOCATION, SqlDbType.VarChar).Value = entity.MeetingLocation; //ANTES
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_DATE, SqlDbType.Date).Value = entity.MeetingDate;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_START_TIME, SqlDbType.Time).Value = entity.MeetingStartTime;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_END_TIME, SqlDbType.Time).Value = entity.MeetingEndTime;
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

        public string updateMeeting(E_Meeting entity)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_Meeting.SP_UPDATE_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = entity.MeetingCode;
                    command.Parameters.Add(SQL_TypeMeeting.PARAM_TYPE_MEETING_CODE, SqlDbType.VarChar).Value = entity.TypeMeetingCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_AREA_ID, SqlDbType.Int).Value = entity.AreaId;
                    command.Parameters.Add(SQL_Meeting.PARAM_CELL_ID, SqlDbType.Int).Value = entity.CellId;
                    command.Parameters.Add(SQL_Meeting.PARAM_UPDATED_BY_USER_ID, SqlDbType.Int).Value = entity.UpdatedByUserId;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_SUBJECT, SqlDbType.VarChar).Value = entity.MeetingSubject;
                    //command.Parameters.Add(SQL_Meeting.PARAM_MEETING_LOCATION, SqlDbType.VarChar).Value = entity.MeetingLocation; //ANTES
                    command.Parameters.Add(SQL_Meeting.PARAM_LOCATION_CODE, SqlDbType.VarChar).Value = entity.LocationCode; //@AMENDEZ5
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_DATE, SqlDbType.Date).Value = entity.MeetingDate;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_START_TIME, SqlDbType.Time).Value = entity.MeetingStartTime;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_END_TIME, SqlDbType.Time).Value = entity.MeetingEndTime;
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

        public string deleteMeeting(string meetingCode, int deletedByUserId)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_Meeting.SP_DELETE_MEETING, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_DELETED_BY_USER_ID, SqlDbType.Int).Value = deletedByUserId;
                    command.ExecuteReader(CommandBehavior.SingleResult);
                    connection.Close();
                    message = "success";
                }

            }
            catch (SqlException ex)
            {
                message = "SQL Error:" + ex.Message;
            }
            return message;
        }

        public string deleteAllMeetingDetail(string meetingCode)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_Meeting.SP_DELETE_ALL_MEETING_DETAIL, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                    command.ExecuteReader(CommandBehavior.SingleResult);
                    connection.Close();
                    message = "success";
                }

            }
            catch (SqlException ex)
            {
                message = "SQL Error:" + ex.Message;
            }
            return message;
        }        

        public string sendEmailPDFMeetingByParticipants(string meetingCode, string fileNamePDF)
        {
            string message = "";
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand(SQL_Meeting.SP_SEND_EMAIL_PDF_MEETING_BY_PARTICIPANTS, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                    command.Parameters.Add(SQL_Meeting.PARAM_FILE_NAME_PDF, SqlDbType.VarChar).Value = fileNamePDF;
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
        
        public string generateNewMeetingCode()
        {
            int maxNumber = 0;
            string prefix = "REU-";

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SP_GetNewMeetingCode", connection);
                command.CommandType = CommandType.StoredProcedure;

                var result = command.ExecuteScalar();
                if (result != null && result != DBNull.Value)
                {
                    // TryParse protege ante cualquier valor inesperado
                    int.TryParse(result.ToString(), out maxNumber);
                }
                connection.Close();
            }

            // Formato REU-000001 (seis dígitos con ceros a la izquierda)
            return $"{prefix}{(maxNumber + 1).ToString("D6")}";
        } //@AMENDEZ5 

        public List<E_Area> getAllArea()
        {
            var list = new List<E_Area>();
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(SQL_Meeting.SP_GET_ALL_AREA, connection))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new E_Area
                            {
                                AreaId = reader["AreaId"] != DBNull.Value ? Convert.ToInt32(reader["AreaId"]) : 0,
                                AreaName = reader["AreaName"]?.ToString()
                            });
                        }
                    }
                }
                connection.Close();
            }
            return list;
        } //@AMENDEZ5

        public DataTable GetMeetingCodeByText(string meetingCode)
        {
            DataTable dt = new DataTable();
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(SQL_Meeting.SP_GET_MEETING_CODE_BY_TEXT, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue(SQL_Meeting.PARAM_MEETING_CODE, meetingCode);
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(dt);
                    }
                }
                connection.Close();
            }
            return dt;
        } //@AMENDEZ5

        public DataSet getAttachFileByMeetingCode(string meetingCode)
        {
            DataSet dtsAttachFile = null;
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
                        dtsAttachFile = new DataSet();
                        sqlcomm.CommandText = SQL_Meeting.SP_GET_ATTACH_FILE_BY_MEETING_CODE;
                        sqlcomm.Parameters.Add(SQL_Meeting.PARAM_MEETING_CODE, SqlDbType.VarChar).Value = meetingCode;
                        sqldt.SelectCommand = sqlcomm;
                        sqldt.SelectCommand.CommandType = CommandType.StoredProcedure;
                        sqldt.Fill(dtsAttachFile, "AttachFile");
                    }
                    sqlConn.Close();
                }
                catch (SqlException ex)
                {
                    dtsAttachFile = new DataSet();
                    DataTable dt = new DataTable("SqlException");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + ex.Message);
                    dtsAttachFile.Tables.Add(dt);
                    dtsAttachFile.Tables[0].TableName = "Error";
                }
                catch (Exception e)
                {
                    dtsAttachFile = new DataSet();
                    DataTable dt = new DataTable("Exception");
                    dt.Columns.Add(new DataColumn("message", typeof(string)));
                    dt.Rows.Add("SQL Error: " + e.Message);
                    dtsAttachFile.Tables.Add(dt);
                    dtsAttachFile.Tables[0].TableName = "Error";
                }
            }
            return dtsAttachFile;
        } //@AMENDEZ5

    }
}