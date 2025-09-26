using System;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http;
using Microsoft.AspNetCore.Cors;

namespace MeetingRecord.WebServices
{    
    public static class WebApiConfig
    {

        public static void Register(HttpConfiguration config)
        {

            // Configuración y servicios de API web
            #region ConfigFormatters
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.JsonFormatter.MediaTypeMappings.Add(new RequestHeaderMapping("Accept", "text/html", StringComparison.InvariantCultureIgnoreCase, true, "application/json"));
            #endregion

            // Rutas de API web
            #region ActionPlan
            config.Routes.MapHttpRoute(
                name: "TaskGet",
                routeTemplate: "api/Meeting/ActionPlan/task_Get",
                defaults: new { controller = "ApiActionPlan", action = "TaskGet" }
            );

            config.Routes.MapHttpRoute(
               name: "TaskClose",
               routeTemplate: "api/Meeting/ActionPlan/task_Close",
               defaults: new { controller = "ApiActionPlan", action = "TaskClose" }
            );

            config.Routes.MapHttpRoute(
               name: "TaskDelete",
               routeTemplate: "api/Meeting/ActionPlan/task_Delete",
               defaults: new { controller = "ApiActionPlan", action = "TaskDelete" }
            );

            config.Routes.MapHttpRoute(
               name: "TaskUpdate",
               routeTemplate: "api/Meeting/ActionPlan/task_Update",
               defaults: new { controller = "ApiActionPlan", action = "TaskUpdate" }
            );

            config.Routes.MapHttpRoute(
              name: "AnnexedInsert",
              routeTemplate: "api/Meeting/ActionPlan/annexed_Insert",
              defaults: new { controller = "ApiActionPlan", action = "AnnexedInsert" }
           );

            config.Routes.MapHttpRoute(
              name: "AnnexedGet",
              routeTemplate: "api/Meeting/ActionPlan/annexed_Get",
              defaults: new { controller = "ApiActionPlan", action = "AnnexedGet" }
           );

            config.Routes.MapHttpRoute(
              name: "TaskGetCountByResponsible",
              routeTemplate: "api/Meeting/ActionPlan/task_GetCountByResponsible",
              defaults: new { controller = "ApiActionPlan", action = "TaskGetCountByResponsible" }
           );
            #endregion

            #region DefaultApi
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            #endregion
        }
    }
}
