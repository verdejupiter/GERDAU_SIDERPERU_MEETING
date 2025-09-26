/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Reporte
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.0
 * @updatedAt       19/08/2025
*/
/*================================================================================================================================================================================*/
$(document).ready(function() {
    initFilterData();
    $("#btn-filter-report-meeting").on("click", getDataRecovery);
    $("#btn-export-to-excel").on("click", exportExcelData).hide();
    AmCharts.addInitHandler(function (chart) {
        var categoryWidth = 25;
        var chartHeight = categoryWidth * chart.dataProvider.length;
        chart.div.style.height = chartHeight + 'px';
        $("#chart_percent_assistance").css("height", chartHeight + 'px');
    }, ['serial'] );
});
/*================================================================================================================================================================================*/
function initFilterData() {
    //getAllTypeMeeting(false);
    getAllArea(true);
    //InitSelect2("#cbo-cell", "Seleccione...", null, false);
    //$("#cbo-cell").val(0).trigger("change");
    $(document).on('change','#cbo-area', function(e){
        var AreaId = parseInt($(this).val());
        //var AreaId = parseInt($(this).select2('val')); ANTES

        /*if(AreaId > 0) {
            $(".div-cell").html('<select id="cbo-cell" class="select-with-search pmd-select2 form-control"></select>');
        }
        getCellByAreaId(AreaId);
        $("#cbo-cell").val(0).trigger("change");  */  
    });
    /*setTimeout(function() {
        $("#cbo-type-meeting").val($("#cbo-type-meeting option:first").val()).trigger("change");
    }, 300);*/
    InitSelect2("#cbo-year", "Seleccione...", null, false);
    InitSelect2("#cbo-month", "Seleccione...", null, false);    
    $("#cbo-year").val(2019).trigger("change");
    $("#cbo-month").val(9).trigger("change");
   
}
/*================================================================================================================================================================================*/
function getDataRecovery() {
    var typeMeetingCode = $("#cbo-type-meeting").val();
    var areaId          = $("#cbo-area").val();
    var cellId          = $("#cbo-cell").val();
    var year            = $("#cbo-year").val();
    var month           = $("#cbo-month").val();
    getReportMeetingUserAssistanceByArgs(typeMeetingCode,areaId, cellId, year, month);
    getReportDetailMeetingUserAssistanceByArgs(typeMeetingCode,areaId, cellId, year, month);
}
/*================================================================================================================================================================================*/
function exportExcelData() {
    var monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var year            = $("#cbo-year").val();
    var month           = $("#cbo-month").val();
    $("#table-detail-user-assistance").table2excel({
        exclude : ".noExl",
        name    : "Seguimiento_Asistencia_" + monthName[month - 1] + "_" + year,
        filename: "Seguimiento_Asistencia_" + monthName[month - 1] + "_" + year
    });
}
/*================================================================================================================================================================================*/
function getReportMeetingUserAssistanceByArgs(typeMeetingCode,areaId, cellId, year, month) {
    $.ajax({
        type        : "GET",
        url         : "GetReportMeetingUserAssistanceByArgs/" + typeMeetingCode + "/" +  areaId + "/" + cellId + "/" + year + "/" + month,
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        beforeSend: function() {
            $("#chart_percent_assistance").html('<div class="center" style="padding:50px;"><div class="preloader-wrapper big active">'
                +'<div class="spinner-layer spinner-blue-only">'
                +'<div class="circle-clipper left"> <div class="circle"></div> </div>'
                +'<div class="gap-patch"> <div class="circle"></div> </div>'
                +'<div class="circle-clipper right"> <div class="circle"></div></div>'
                +'</div></div></div>');
        },
        success: function(response) {
            var responseJson = $.parseJSON(response);
            var reportArray  = responseJson.Report;
            if(reportArray.length > 0) {
                amChartBar_UserAssistance(reportArray);
            }
            else {
                $("#chart_percent_assistance").html('<div class="center" style="padding:150px;font-size:20px;color:#828282;">No se encontraros datos</div>');
            }            
        },
        error: function(response) {
            $("#chart_percent_assistance").html('<div class="center" style="padding:150px;font-size:20px;color:#828282;">No se encontraros datos</div>');
        }
    });
    
}
/*================================================================================================================================================================================*/
function amChartBar_UserAssistance(reportArray) {
    var chart = AmCharts.makeChart("chart_percent_assistance",
    {
        "type"         : "serial",
        "categoryField": "UserName",
        "rotate"       : true,
        "startDuration": 1,
        "categoryAxis"  : {"gridPosition": "start", "gridThickness": 0, "axisThickness": 0},
        "trendLines"    : [],
        "graphs": [            
            {
                "labelText"    : "[[percents]]%",
                "labelPosition": "middle",
                "balloonText"  : "[[title]] : [[value]]",
                "fillAlphas"   : 1,
                "id"           : "AmGraph-1",
                "title"        : "Participa",
                "type"         : "column",
                "lineColor"    : "#01cb66",
                "valueField"   : "Asistencia"
            },
            {
                "labelText"    : "[[percents]]%",
                "labelPosition": "middle",
                "balloonText"  : "[[title]] : [[value]]",
                "fillAlphas"   : 1,
                "title"        : "Justificado",
                "type"         : "column",
                "id"           : "AmGraph-2",
                "lineColor"    : "#ffcc00",
                "valueField"   : "Justificado",
            },
            {
                "labelText"    : "[[percents]]%",
                "labelPosition": "middle",
                "balloonText"  : "[[title]] : [[value]]",
                "fillAlphas"   : 1,
                "id"           : "AmGraph-3",
                "title"        : "No Participa",
                "type"         : "column",
                "lineColor"    : "#cc0000",
                "valueField"   : "Inasistencia"
            },
        ],
        "valueAxes": [
            {
                "id"           : "ValueAxis-1",
                "stackType"    : "100%",
                "labelsEnabled": false,
                "gridAlpha"    : 0,
                "axisAlpha "   : 0,
                "tickLength"   : 0,
                "axisThickness": 0

            }
        ],
        "legend": {
            "enabled"         : true,
            "useGraphSettings": true,
            "position"        : "top"
        },
        "dataProvider": reportArray
    });    
}
/*================================================================================================================================================================================*/
function getReportDetailMeetingUserAssistanceByArgs(typeMeetingCode,areaId, cellId, year, month) {
    var days      = getDaysArrayByMonthYear(month, year);    
    var nro       = days.length;    
    var col_one   = Math.round(nro/3);
    var col_two   = Math.round( (nro - col_one) / 2 );
    var col_three = Math.round(nro - (col_one+col_two));
    $("#th-asistencia").attr("colspan",nro);
    $("#th-participa").attr("colspan",col_one);
    $("#th-justificado").attr("colspan",col_two);
    $("#th-no-participa").attr("colspan",col_three);    
    $("#table-detail-user-assistance thead tr#name_days").html('');
    $("#table-detail-user-assistance thead tr#num_days").html('');    
    $("#table-detail-user-assistance tbody").html("").attr("style","font-size: 10px!important;");    
    $.each(days, function (i, item) {
        $("#table-detail-user-assistance thead tr#name_days").append("<th>"+item.name_day+"</th>");
        $("#table-detail-user-assistance thead tr#num_days").append("<th>"+item.number_day+"</th>");
    });    
    $.ajax({
        type       : "GET",
        url        : "GetReportDetailMeetingUserAssistanceByArgs/" + typeMeetingCode + "/" +  areaId + "/" + cellId + "/" + year + "/" + month,
        contentType: "application/json; charset = utf-8",
        dataType   : "json",
        beforeSend: function() {
            $("#btn-export-to-excel").hide();
            $("#table-detail-user-assistance").hide();
            $("#div-detail-user-assistance").html('<div class="center" style="padding:50px;"><div class="preloader-wrapper big active">'
                +'<div class="spinner-layer spinner-blue-only">'
                +'<div class="circle-clipper left"> <div class="circle"></div> </div>'
                +'<div class="gap-patch"> <div class="circle"></div> </div>'
                +'<div class="circle-clipper right"> <div class="circle"></div></div>'
                +'</div></div></div>');
        },
        success:function(response) {
            response = $.parseJSON(response);
            if(response.InfoReport.length > 0) {
                $("#btn-export-to-excel").show("slow")
                $("#table-detail-user-assistance").show();
                $("#div-detail-user-assistance").empty();
                var total_pg = 0;
                var total_jg = 0;
                var total_ng = 0;
                $.each(response.InfoReport, function (i, item) {
                    var htmlAreaCell = "";
                    if(item.AreaName != '') {
                        htmlAreaCell = item.AreaName + (item.CellName != '' ? ' - ' + item.CellName + ' - ' : '');
                    }
                    $(".title-filter").html(item.TypeMeetingDescription + " : " + htmlAreaCell  + item.MonthName + " - " + item.Year)
                });            
                $.each(response.Report, function (i, item) { 
                    var count_p    = 0;
                    var count_j    = 0;
                    var count_n    = 0;
                    var total      = 0;
                    var percents_p = 0;
                    var percents_j = 0;
                    var percents_n = 0;
                    var row        = '<tr>';
                    row +='<td>'+item.UserDni+'</td>';
                    row +='<td>'+item.UserName+'</td>';
                    for(var j = 1; j <= nro; j++) {
                        var position = 'item.day_'+j;
                        if(eval(position) != null) {
                            switch(eval(position)) {
                                case "P":
                                    row +='<td class="people-p" style="background-color: #00CC66; text-align: center; font-weight: bold;">' + eval(position) + '</td>'; 
                                    count_p++; 
                                    total_pg++;
                                    break;
                                case "J":
                                    row +='<td class="people-j" style="background-color: #FFCC00; text-align: center; font-weight: bold;">' + eval(position) + '</td>';
                                    count_j++;
                                    total_jg++;
                                    break;
                                case "N":
                                    row +='<td class="people-n" style="background-color: #CC0000; text-align: center; font-weight: bold;">' + eval(position) + '</td>';
                                    count_n++;
                                    total_ng++;
                                    break;
                                default:
                                    row +='<td>&nbsp;</td>';
                                    break
                            }
                        }
                        else {
                            row +='<td>&nbsp;</td>';
                        }                    
                    }
                    total      = count_p+count_j+count_n;
                    percents_p = count_p != 0 ? (count_p*100)/total : 0;
                    percents_j = count_j != 0 ? (count_j*100)/total : 0;
                    percents_n = count_n != 0 ? (count_n*100)/total : 0;
                    row +='<td class="people-total" style="background-color: #c8e6f1; text-align: center;">'+count_p+'</td>';
                    row +='<td class="people-total" style="background-color: #c8e6f1; text-align: center;">'+count_j+'</td>';
                    row +='<td class="people-total" style="background-color: #c8e6f1; text-align: center;">'+count_n+'</td>';
                    row +='<td class="people-total" style="background-color: #c8e6f1; text-align: center;">'+Math.round(percents_p)+'%</td>';
                    row +='<td class="people-total" style="background-color: #c8e6f1; text-align: center;">'+Math.round(percents_j)+'%</td>';
                    row +='<td class="people-total" style="background-color: #c8e6f1; text-align: center;">'+Math.round(percents_n)+'%</td>';
                    row +='</tr>';
                    $("#table-detail-user-assistance tbody").append(row);
                });
                var total_percents = total_pg+total_jg+total_ng;
                total_pg           = Math.round((total_pg*100)/total_percents);
                total_jg           = Math.round((total_jg*100)/total_percents);
                total_ng           = Math.round((total_ng*100)/total_percents);
                $("#table-detail-user-assistance").find("#total-p").html("Total : "+total_pg+"%");
                $("#table-detail-user-assistance").find("#total-j").html("Total : "+total_jg+"%");
                $("#table-detail-user-assistance").find("#total-n").html("Total : "+total_ng+"%");
            }
            else {
                $("#btn-export-to-excel").hide();
                $("#table-detail-user-assistance").hide();
                $("#div-detail-user-assistance").html('<div class="center" style="padding:50px;font-size:20px;color:#828282;">No se encontraros datos</div>');
            }
        },
        error:function(response) {
            $("#btn-export-to-excel").hide();
            $("#table-detail-user-assistance").hide();
            $("#div-detail-user-assistance").html('<div class="center" style="padding:50px;font-size:20px;color:#828282;">No se encontraros datos</div>');
        }
    });
}
/*================================================================================================================================================================================*/