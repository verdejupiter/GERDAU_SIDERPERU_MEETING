using System.Web.Mvc;
using System.Web.Routing;

namespace MeetingRecord.AppWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //@AMENDEZ5
            #region Location
            routes.MapRoute(
                    name: "LocationMeeting",
                    url: "LocationMeeting",
                    defaults: new { controller = "LocationMeeting", action = "Index" }
            );

            routes.MapRoute(
                      name: "getAllLocationMeeting",
                      url: "getAllLocationMeeting",
                      defaults: new { controller = "LocationMeeting", action = "getAllLocationMeeting" }
                  );

            routes.MapRoute(
                      name: "insertLocationMeeting",
                      url: "insertLocationMeeting",
                      defaults: new { controller = "LocationMeeting", action = "insertLocationMeeting" }
                  );
            routes.MapRoute(
                      name: "updateLocationMeeting",
                      url: "updateLocationMeeting",
                      defaults: new { controller = "LocationMeeting", action = "updateLocationMeeting" }
                  );
            routes.MapRoute(
                      name: "deleteLocationMeeting",
                      url: "deleteLocationMeeting",
                      defaults: new { controller = "LocationMeeting", action = "deleteLocationMeeting" }
                  );
            routes.MapRoute(
                    name: "getAllLocationMeetingActive",
                    url: "getAllLocationMeetingActive",
                    defaults: new { controller = "LocationMeeting", action = "getAllLocationMeetingActive" }
             );
            #endregion

            #region ActionPlanCategory
            routes.MapRoute(
                    name: "ActionPlanCategory",
                    url: "ActionPlanCategory",
                    defaults: new { controller = "ActionPlanCategory", action = "Index" }
            );

            routes.MapRoute(
                    name: "getAllActionPlanCategory",
                    url: "getAllActionPlanCategory",
                    defaults: new { controller = "ActionPlanCategory", action = "getAllActionPlanCategory" }
            );

            routes.MapRoute(
                    name: "insertActionPlanCategory",
                    url: "insertActionPlanCategory",
                    defaults: new { controller = "ActionPlanCategory", action = "insertActionPlanCategory" }
            );

            routes.MapRoute(
                    name: "updateActionPlanCategory",
                    url: "updateActionPlanCategory",
                    defaults: new { controller = "ActionPlanCategory", action = "updateActionPlanCategory" }
            );

            routes.MapRoute(
                    name: "deleteActionPlanCategory",
                    url: "deleteActionPlanCategory",
                    defaults: new { controller = "ActionPlanCategory", action = "deleteActionPlanCategory" }
            );

            routes.MapRoute(
                    name: "getAllActionPlanCategoryActive",
                    url: "getAllActionPlanCategoryActive",
                    defaults: new { controller = "ActionPlanCategory", action = "getAllActionPlanCategoryActive" }
            );
            #endregion
            //@AMENDEZ5

            #region Report
            routes.MapRoute(
                      name: "Report",
                      url: "Report",
                      defaults: new { controller = "Report", action = "Index" }
                  );

            routes.MapRoute(
                     name: "GetReportMeetingUserAssistanceByArgs",
                     url: "GetReportMeetingUserAssistanceByArgs/{typeMeetingCode}/{areaId}/{cellId}/{year}/{month}",
                     defaults: new
                     {
                         controller         = "Report",
                         action             = "GetReportMeetingUserAssistanceByArgs",
                         typeMeetingCode    = UrlParameter.Optional,
                         areaId             = UrlParameter.Optional,
                         cellId             = UrlParameter.Optional,
                         year               = UrlParameter.Optional,
                         month              = UrlParameter.Optional
                     }
                 );

            routes.MapRoute(
                     name: "GetReportDetailMeetingUserAssistanceByArgs",
                     url: "GetReportDetailMeetingUserAssistanceByArgs/{typeMeetingCode}/{areaId}/{cellId}/{year}/{month}",
                     defaults: new
                     {
                         controller = "Report",
                         action = "GetReportDetailMeetingUserAssistanceByArgs",
                         typeMeetingCode = UrlParameter.Optional,
                         areaId = UrlParameter.Optional,
                         cellId = UrlParameter.Optional,
                         year = UrlParameter.Optional,
                         month = UrlParameter.Optional
                     }
                 );
            #endregion

            #region AttachFile
            routes.MapRoute(
                      name: "getAttachFileByMeetingCode",
                      url: "getAttachFileByMeetingCode",
                      defaults: new { controller = "AttachFile", action = "getAttachFileByMeetingCode"}
                  );

            routes.MapRoute(
                      name: "insertAttachFile",
                      url: "insertAttachFile",
                      defaults: new { controller = "AttachFile", action = "insertAttachFile" }
                  );
            routes.MapRoute(
                      name: "deleteAttachFile",
                      url: "deleteAttachFile",
                      defaults: new { controller = "AttachFile", action = "deleteAttachFile" }
                  );
            #endregion

            #region Home
            routes.MapRoute(
                    name: "AccessWeb",
                    url: "AccessWeb",
                    defaults: new { controller = "Home", action = "AccessWeb" }
                );

            routes.MapRoute(
                      name: "Login",
                      url: "Login",
                      defaults: new { controller = "Home", action = "Login" }
                  );
            routes.MapRoute(
                      name: "Home",
                      url: "Home",
                      defaults: new { controller = "Home", action = "Index" }
                  );
            routes.MapRoute(
                      name: "Logout",
                      url: "Logout",
                      defaults: new { controller = "Home", action = "Logout" }
                  );
            #endregion

            #region TypeMeeting
            routes.MapRoute(
                      name: "TypeMeeting",
                      url: "TypeMeeting",
                      defaults: new { controller = "TypeMeeting", action = "Index" }
                  );

            routes.MapRoute(
                     name: "getAllTypeMeeting",
                     url: "getAllTypeMeeting",
                     defaults: new { controller = "TypeMeeting", action = "getAllTypeMeeting" }
                 );

            routes.MapRoute(
                      name: "insertTypeMeeting",
                      url: "insertTypeMeeting",
                      defaults: new { controller = "TypeMeeting", action = "insertTypeMeeting" }
                  );

            routes.MapRoute(
                      name: "updateTypeMeeting",
                      url: "updateTypeMeeting",
                      defaults: new { controller = "TypeMeeting", action = "updateTypeMeeting" }
                  );

            routes.MapRoute(
                      name: "deleteTypeMeeting",
                      url: "deleteTypeMeeting",
                      defaults: new { controller = "TypeMeeting", action = "deleteTypeMeeting" }
                  );
            routes.MapRoute(
                    name: "getAllTypeMeetingActive",
                    url: "getAllTypeMeetingActive",
                    defaults: new { controller = "TypeMeeting", action = "getAllTypeMeetingActive" }
                  ); //@AMENDEZ5
            //@AMENDEZ5 16/8
            routes.MapRoute(
                    name: "getTypeMeetingByArea",
                    url: "getTypeMeetingByArea",
                    defaults: new { controller = "TypeMeeting", action = "getTypeMeetingByArea" }
                  ); 
            //@AMENDEZ5 16/8
            #endregion

            #region TypeMeetingDetail
            routes.MapRoute(
                     name: "getTypeMeetingDetailByCode",
                     url: "getTypeMeetingDetailByCode",
                     defaults: new { controller = "TypeMeetingDetail", action = "getTypeMeetingDetailByCode" }
                 );

            routes.MapRoute(
                      name: "insertTypeMeetingDetail",
                      url: "insertTypeMeetingDetail",
                      defaults: new { controller = "TypeMeetingDetail", action = "insertTypeMeetingDetail" }
                  );

            routes.MapRoute(
                      name: "deleteTypeMeetingDetail",
                      url: "deleteTypeMeetingDetail",
                      defaults: new { controller = "TypeMeetingDetail", action = "deleteTypeMeetingDetail" }
                  );
            #endregion

            #region Meeting
            routes.MapRoute(
                      name: "Meeting",
                      url: "Meeting",
                      defaults: new { controller = "Meeting", action = "Index" }
                  );
            routes.MapRoute(
                      name: "MeetingList",
                      url: "MeetingList",
                      defaults: new { controller = "Meeting", action = "MeetingList" }
                  );
            routes.MapRoute(
                      name: "MeetingDetail",
                      url: "MeetingDetail/{meetingCode}",
                      defaults: new { controller = "Meeting", action = "MeetingDetail" , meetingCode = UrlParameter.Optional }
                  );

            routes.MapRoute(
                      name: "MeetingDetailPDF",
                      url: "MeetingDetailPDF/{meetingCode}",
                      defaults: new { controller = "Meeting", action = "MeetingDetailPDF", meetingCode = UrlParameter.Optional }
                  );

            routes.MapRoute(
                      name: "MeetingRegister",
                      url: "MeetingRegister",
                      defaults: new { controller = "Meeting", action = "MeetingRegister" }
                  );

            routes.MapRoute(
                      name: "MeetingEdit",
                      url: "MeetingEdit/{meetingCode}",
                      defaults: new { controller = "Meeting", action = "MeetingEdit", meetingCode = UrlParameter.Optional }
                  );

            routes.MapRoute(
                      name: "getMeetingByArgs",
                      url: "getMeetingByArgs",
                      defaults: new { controller = "Meeting", action = "getMeetingByArgs" }
                  );

            routes.MapRoute(
                      name: "insertMeeting",
                      url: "insertMeeting",
                      defaults: new { controller = "Meeting", action = "insertMeeting" }
                  );

            routes.MapRoute(
                      name: "updateMeeting",
                      url: "updateMeeting",
                      defaults: new { controller = "Meeting", action = "updateMeeting" }
                  );

            routes.MapRoute(
                      name: "deleteMeeting",
                      url: "deleteMeeting",
                      defaults: new { controller = "Meeting", action = "deleteMeeting" }
                  );

            routes.MapRoute(
                     name: "deleteAllMeetingDetail",
                     url: "deleteAllMeetingDetail",
                     defaults: new { controller = "Meeting", action = "deleteAllMeetingDetail" }
                 );

            routes.MapRoute(
                     name: "getMeetingByArgsExportToExcel",
                     url: "getMeetingByArgsExportToExcel/{meetingId}/{areaId}/{cellId}/{typeMeetingCode}/{startDate}/{endDate}/{userId}/{description}/{meetingCode}/{mineScope}/{creatorUserId}",
                     defaults: new { controller = "Meeting", action = "getMeetingByArgsExportToExcel" ,
                         meetingId          = UrlParameter.Optional,
                         areaId             = UrlParameter.Optional,
                         cellId             = UrlParameter.Optional,
                         typeMeetingCode    = UrlParameter.Optional,
                         startDate          = UrlParameter.Optional,
                         endDate            = UrlParameter.Optional,
                         userId             = UrlParameter.Optional,
                         description        = UrlParameter.Optional,
                         meetingCode        = UrlParameter.Optional,
                         mineScope          = UrlParameter.Optional,
                         creatorUserId      = UrlParameter.Optional, // @AMENDEZ5 4 / 08
                     }
                 );
            routes.MapRoute(
                      name: "getMeetingByCodeSavePdf",
                      url: "getMeetingByCodeSavePdf/{meetingCode}",
                      defaults: new { controller = "Meeting", action = "getMeetingByCodeSavePdf", meetingCode = UrlParameter.Optional }
                  );

            routes.MapRoute(
                      name: "getMeetingByCodeExportToPDF",
                      url: "getMeetingByCodeExportToPDF/{meetingCode}",
                      defaults: new { controller = "Meeting", action = "getMeetingByCodeExportToPDF", meetingCode = UrlParameter.Optional }
                  );
            routes.MapRoute(
                      name: "getNewMeetingCode",
                      url: "getNewMeetingCode",
                      defaults: new { controller = "Meeting", action = "getNewMeetingCode" }
                  ); //@AMENDEZ5
            routes.MapRoute(
                      name: "getAllArea",
                      url: "getAllArea",
                      defaults: new { controller = "Meeting", action = "getAllArea" }
                  ); //@AMENDEZ5
            routes.MapRoute(
                    name: "getMeetingCodesAutocomplete",
                    url: "getMeetingCodesAutocomplete",
                    defaults: new { controller = "Meeting", action = "getMeetingCodesAutocomplete" }
                ); //@AMENDEZ5

            #endregion

            #region User
            routes.MapRoute(
                      name: "User",
                      url: "User",
                      defaults: new { controller = "User", action = "Index" }
                  );

            routes.MapRoute(
                      name: "getUserByLoginAD",
                      url: "getUserByLoginAD",
                      defaults: new { controller = "User", action = "getUserByLoginAD" }
                  );

            routes.MapRoute(
                      name: "getUserByUserName",
                      url: "getUserByUserName",
                      defaults: new { controller = "User", action = "getUserByUserName" }
                  );

            routes.MapRoute(
                      name: "getUserByUserNetName",
                      url: "getUserByUserNetName/{userNetName}",
                      defaults: new { controller = "User", action = "getUserByUserNetName", userNetName = UrlParameter.Optional }
                  );

            routes.MapRoute(
                      name: "getAllMEUser",
                      url: "getAllMEUser",
                      defaults: new { controller = "User", action = "getAllMEUser" }
                  );

            routes.MapRoute(
                      name: "insertMEUser",
                      url: "insertMEUser",
                      defaults: new { controller = "User", action = "insertMEUser" }
                  );
            routes.MapRoute(
                      name: "updateMEUser",
                      url: "updateMEUser",
                      defaults: new { controller = "User", action = "updateMEUser" }
                  );
            routes.MapRoute(
                      name: "deleteMEUser",
                      url: "deleteMEUser",
                      defaults: new { controller = "User", action = "deleteMEUser" }
                  );
            #endregion

            #region ActionPlan
            routes.MapRoute(
                      name: "ActionPlan",
                      url: "ActionPlan",
                      defaults: new { controller = "ActionPlan", action = "Index" }
                  );

            routes.MapRoute(
                      name: "insertActionPlan",
                      url: "insertActionPlan",
                      defaults: new { controller = "ActionPlan", action = "insertActionPlan" }
                  );

            routes.MapRoute(
                      name: "getActionPlanByUserId",
                      url: "getActionPlanByUserId",
                      defaults: new { controller = "ActionPlan", action = "getActionPlanByUserId" }
                  );

            routes.MapRoute(
                      name: "getActionPlanByMeetingCode",
                      url: "getActionPlanByMeetingCode",
                      defaults: new { controller = "ActionPlan", action = "getActionPlanByMeetingCode" }
                  );

            routes.MapRoute(
                      name: "getActionPlanExecutedByArgs",
                      url: "getActionPlanExecutedByArgs",
                      defaults: new { controller = "ActionPlan", action = "getActionPlanExecutedByArgs" }
                  );

            routes.MapRoute(
                      name: "getActionPlanPendingByArgs",
                      url: "getActionPlanPendingByArgs",
                      defaults: new { controller = "ActionPlan", action = "getActionPlanPendingByArgs" }
                  );

            routes.MapRoute(
                      name: "executeActionPlan",
                      url: "executeActionPlan",
                      defaults: new { controller = "ActionPlan", action = "executeActionPlan" }
                  );
            routes.MapRoute(
                  name: "updateActionPlan",
                  url: "updateActionPlan",
                  defaults: new { controller = "ActionPlan", action = "updateActionPlan" }
              ); //@AMENDEZ5
            routes.MapRoute(
                  name: "deleteActionPlan",
                  url: "deleteActionPlan",
                  defaults: new { controller = "ActionPlan", action = "deleteActionPlan" }
              ); //@AMENDEZ5
            routes.MapRoute(
                name: "getActionPlanByCode",
                url: "getActionPlanByCode",
                defaults: new { controller = "ActionPlan", action = "getActionPlanByCode" }
            );//@AMENDEZ5
            routes.MapRoute(
                name: "getActionPlanPendingExportToExcel",
                url: "ActionPlan/getActionPlanPendingExportToExcel/{responsibleUserId}/{meetingCode}/{startDate}/{endDate}/{userId}/{mineScope}/{actionPlanStatus}/{actionPlanPriority}/{actionPlanCategoryId}/{dateFilterType}",
                defaults: new
                {
                    controller = "ActionPlan",
                    action = "getActionPlanPendingExportToExcel",
                    responsibleUserId = UrlParameter.Optional,
                    meetingCode = UrlParameter.Optional,
                    startDate = UrlParameter.Optional,
                    endDate = UrlParameter.Optional,
                    userId = UrlParameter.Optional,
                    mineScope = UrlParameter.Optional,
                    actionPlanStatus = UrlParameter.Optional,
                    actionPlanPriority = UrlParameter.Optional,
                    actionPlanCategoryId = UrlParameter.Optional,
                    dateFilterType = UrlParameter.Optional
                }
            );
            routes.MapRoute(
                name: "getActionPlanExecutedExportToExcel",
                url: "ActionPlan/getActionPlanExecutedExportToExcel/{responsibleUserId}/{meetingCode}/{startDate}/{endDate}/{userId}/{mineScope}/{actionPlanStatus}/{actionPlanPriority}/{actionPlanCategoryId}/{dateFilterType}",
                defaults: new
                {
                    controller = "ActionPlan",
                    action = "getActionPlanExecutedExportToExcel",
                    responsibleUserId = UrlParameter.Optional,
                    meetingCode = UrlParameter.Optional,
                    startDate = UrlParameter.Optional,
                    endDate = UrlParameter.Optional,
                    userId = UrlParameter.Optional,
                    mineScope = UrlParameter.Optional,
                    actionPlanStatus = UrlParameter.Optional,
                    actionPlanPriority = UrlParameter.Optional,
                    actionPlanCategoryId = UrlParameter.Optional,
                    dateFilterType = UrlParameter.Optional
                }
            );
            //@AMENDEZ5
            #endregion

            #region ActionPlanDetail
            routes.MapRoute(
                      name: "insertActionPlanDetail",
                      url: "insertActionPlanDetail",
                      defaults: new { controller = "ActionPlanDetail", action = "insertActionPlanDetail" }
                  );

            routes.MapRoute(
                      name: "getActionPlanDetailByActionPlanCode",
                      url: "getActionPlanDetailByActionPlanCode",
                      defaults: new { controller = "ActionPlanDetail", action = "getActionPlanDetailByActionPlanCode" }
                  );
            routes.MapRoute(
                  name: "deleteActionPlanDetail",
                  url: "deleteActionPlanDetail",
                  defaults: new { controller = "ActionPlanDetail", action = "deleteActionPlanDetail" }
              ); //@AMENDEZ5
            #endregion

            #region UserAssistance
            routes.MapRoute(
                      name: "insertUserAssistance",
                      url: "insertUserAssistance",
                      defaults: new { controller = "UserAssistance", action = "insertUserAssistance" }
                  );
            #endregion

            #region Guide
            routes.MapRoute(
                      name: "insertGuide",
                      url: "insertGuide",
                      defaults: new { controller = "Guide", action = "insertGuide" }
                  );
            #endregion

            #region MeetingDev
            routes.MapRoute(
                      name: "insertMeetingDev",
                      url: "insertMeetingDev",
                      defaults: new { controller = "MeetingDevelopment", action = "insertMeetingDev" }
                  );

            routes.MapRoute(
                      name: "insertMeetingDevWithImage",
                      url: "insertMeetingDevWithImage",
                      defaults: new { controller = "MeetingDevelopment", action = "insertMeetingDevWithImage" }
                  );
            #endregion

            #region Default
            routes.MapRoute(
                   name: "Default",
                   url: "{controller}/{action}/{id}",
                   defaults: new { controller = "Home", action = "Login", id = UrlParameter.Optional }
               );
            #endregion
        }
    }
}
