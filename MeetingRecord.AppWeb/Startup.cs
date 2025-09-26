using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Owin;
using Owin;
using System;

[assembly: OwinStartupAttribute(typeof(MeetingRecord.AppWeb.Startup))]
namespace MeetingRecord.AppWeb
{
    public partial class Startup
    {       

        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddCors();
        }
        //public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        //{
        //    if (env.IsDevelopment())
        //    {
        //        app.UseDeveloperExceptionPage();
        //        app.UseBrowserLink();
        //    }
        //    else
        //    {
        //        app.UseExceptionHandler("/Home/Error");
        //    }

        //    app.UseStaticFiles();

        //    app.UseMvc(routes =>
        //    {
        //        routes.MapRoute(
        //            name: "default",
        //            template: "{controller=Home}/{action=Index}/{id?}");
        //    });

        //    // var webRootPath = env.WebRootPath;
        //    // call rotativa conf passing env to get web root path
        //    RotativaConfiguration.Setup(env);
        //}
    }
}
