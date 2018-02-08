define(function(){
	'use strict';
	var preliminaryReportServer = preliminaryReportServer || {
		/*生成报告*/
		getReport:function(data){
			return $.ajax({
				type:"post",
				url:"/api/v1/preliminaryReport/generationReport",
				dataType:"json",
				data:data
			});
		},
		/*下载报告*/
		downReportFn:function(data){
			return $.ajax({
				type:"get",
				url:"/api/v1/preliminaryReport/downloadReport/"+encodeURIComponent(yf.userInfo.city)+"/"+data.reportId,
				dataType:"json"
			});
		}
	};
	return preliminaryReportServer;
})