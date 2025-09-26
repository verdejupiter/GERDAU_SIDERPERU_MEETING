using System.Web;
using System.Web.Optimization;
using System.Web.UI.WebControls;

namespace MeetingRecord.AppWeb
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;

            #region StyleBundle

            #region MeterialDesign
            bundles.Add(new StyleBundle("~/bundles/css/MaterialDesign").Include(
                        "~/Content/MaterialDesign/css/custom/custom.css",
                        "~/Content/MaterialDesign/vendors/perfect-scrollbar/perfect-scrollbar.css",
                        "~/Content/MaterialDesign/vendors/jvectormap/jquery-jvectormap.css",
                        "~/Content/MaterialDesign/vendors/flag-icon/css/flag-icon.min.css",
                        //"~/Content/MaterialDesign/vendors/dropify/css/dropify.min.css",
                        //"~/Content/MaterialDesign/vendors/dropify-multiple/css/dropify-multiple.min.css", //@AMENDEZ5 dropify-multiple-modern
                        "~/Content/library/autoComplete2/css/jquery.auto-complete.css",
                        "~/Content/library/select2/css/select2.min.css",
                        "~/Content/library/select2/css/select2-bootstrap.css",
                        "~/Content/library/select2/css/pmd-select2.css",
                        "~/Content/MeetingRecordAppWeb/mr-appweb.min.css",
                        "~/Content/MaterialDesign/vendors/bootstrap-fileinput/css/fileinput.min.css" //@AMENDEZ5 NEW FILE INPUT PLUGIN

                        ));

            #endregion

            #region Datatable
            bundles.Add(new StyleBundle("~/bundles/css/Datatable").Include(
                         "~/Content/library/datatable/css/jquery.dataTables.min.css",
                         "~/Content/library/datatable/css/responsive.dataTables.min.css",
                         "~/Content/library/datatable/css/fixedHeader.dataTables.min.css",
                         "~/Content/library/datatable/css/theme.dataTables.css"
                    ));
            #endregion

            #region AmCharts3
            bundles.Add(new StyleBundle("~/bundles/css/AmCharts3").Include(
                       "~/Content/MaterialDesign/plugin/amcharts3/amcharts/plugins/export/export.css"
                    ));
            #endregion

            #endregion

            #region ScriptBundle

            #region MaterialDesign
            bundles.Add(new ScriptBundle("~/bundles/js/MaterialDesign").Include(
                        "~/Content/MaterialDesign/vendors/jquery-3.2.1.min.js",
                        "~/Content/MaterialDesign/js/materialize.min.js",
                        "~/Content/MaterialDesign/vendors/prism/prism.js",
                        "~/Content/MaterialDesign/vendors/perfect-scrollbar/perfect-scrollbar.min.js",
                        "~/Content/MaterialDesign/js/scripts/advanced-ui-modals.js",
                        "~/Content/MaterialDesign/vendors/jquery-validation/jquery.validate.min.js",
                        "~/Content/MaterialDesign/vendors/jquery-validation/additional-methods.min.js",
                        "~/Content/MaterialDesign/js/scripts/form-validation.js",
                        "~/Content/library/select2/js/select2.full.js",
                        "~/Content/MaterialDesign/vendors/bootstrap-fileinput/js/fileinput.min.js", //@AMENDEZ5 NEW FILE INPUT PLUGIN
                        "~/Content/MaterialDesign/vendors/bootstrap-fileinput/js/locales/es.js"
                        ));

            #endregion

            #region Datatable
            bundles.Add(new ScriptBundle("~/bundles/js/Datatable").Include(
                     "~/Content/library/datatable/js/last_version/jquery.dataTables.min.js",
                     "~/Content/library/datatable/js/last_version/dataTables.fixedColumns.min.js",
                     "~/Content/library/datatable/js/last_version/dataTables.select.min.js"
                     ));
            #endregion

            #region AccessWeb
            bundles.Add(new ScriptBundle("~/bundles/js/AccessWeb").Include(
                        "~/Scripts/S_AccessWeb.js"
                        ));
            #endregion

            #region Login
            bundles.Add(new ScriptBundle("~/bundles/js/Login").Include(
                        "~/Scripts/S_HelperFunction.js",
                        "~/Scripts/S_Login.js"
                        ));
            #endregion

            #region Home
            bundles.Add(new ScriptBundle("~/bundles/js/HelperFunction").Include(
                        "~/Content/library/autoComplete2/js/jquery.auto-complete.min.js",
                        "~/Scripts/S_HelperFunction.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/js/Home").Include(
                        "~/Scripts/S_Home.js"
                        ));
            #endregion

            #region Meeting
            bundles.Add(new ScriptBundle("~/bundles/js/MeetingList").Include(
                        "~/Scripts/S_MeetingList.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/js/MeetingRegister").Include(
                        "~/Scripts/S_MeetingRegister.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/js/MeetingEdit").Include(
                        "~/Scripts/S_MeetingEdit.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/js/MeetingDetail").Include(
                        "~/Scripts/S_MeetingDetail.js"
                        ));
            #endregion

            #region TypeMeeting
            bundles.Add(new ScriptBundle("~/bundles/js/TypeMeeting").Include(
                "~/Scripts/S_TypeMeeting.js"
            ));
            #endregion

            #region User
            bundles.Add(new ScriptBundle("~/bundles/js/User").Include(
                "~/Scripts/S_User.js"
            ));
            #endregion

            #region ActionPlan
            bundles.Add(new ScriptBundle("~/bundles/js/ActionPlan").Include(
                        "~/Scripts/S_ActionPlan.js"
                        ));
            #endregion

            //@AMENDEZ5
            #region LocationMeeting
            bundles.Add(new ScriptBundle("~/bundles/js/LocationMeeting").Include(
                        "~/Scripts/S_LocationMeeting.js"
                        ));
            #endregion

            //@AMENDEZ5
            #region ActionPlanCategory
            bundles.Add(new ScriptBundle("~/bundles/js/ActionPlanCategory").Include(
                        "~/Scripts/S_ActionPlanCategory.js"
                        ));
            #endregion

            #region Report
            bundles.Add(new ScriptBundle("~/bundles/js/Report").Include(
                        "~/Scripts/S_Report.js"
                        ));
            #endregion

            #region AmCharts3
            bundles.Add(new ScriptBundle("~/bundles/js/AmCharts3").Include(
                        "~/Content/MaterialDesign/plugin/amcharts3/amcharts/amcharts.js",
                        "~/Content/MaterialDesign/plugin/amcharts3/amcharts/serial.js",
                        "~/Content/MaterialDesign/plugin/amcharts3/amcharts/pie.js",
                        "~/Content/MaterialDesign/plugin/amcharts3/amcharts/plugins/export/export.js",
                        "~/Content/MaterialDesign/plugin/amcharts3/amcharts/lang/es.js"
                    ));
            #endregion

            #region ExportExcel
            bundles.Add(new ScriptBundle("~/bundles/js/ExportExcel").Include(
                "~/Content/library/exportExcel/jquery.table2excel.js"
            ));
            #endregion

            #endregion
        }
    }
}
