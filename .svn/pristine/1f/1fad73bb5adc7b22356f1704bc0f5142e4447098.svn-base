define(function() {
    'use strict';
   var queryServer=queryServer||{
   		/*获取列表*/
   		getTableList:function(data){
   			return $.ajax({
				type: 'get',
				url: '/api/v1/valuation/records?'+new Date().getTime(),
				dataType: 'json',
				data: data
			});
   		},
   		/*获取历史纪录*/
   		getLocalRecord:function(id){
   			return $.ajax({
				type: 'get',
				url: '/api/v1/valuation/records/detail/'+id,
				dataType: 'json',
			});
   		},
   		/*导出excel*/
   		getExcelExport:function(data){
   			return $.ajax({
   				type:"get",
   				url:"/api/v1/valuation/records/export",
   				data:data
   			});
   		},
   		/*获取机构*/
		getMechanisms:function(data){
			return $.ajax({
				type:"get",
				url:"/api/v1/jurisdictionManagement/lowerLevelGet",
				data:{
					moduleName:data.moduleName,//（'询价记录关联','估值共享关联'，'抵押比率关联'）
					selectCity:data.selectCity||'',
					cityName:yf.userInfo.city
				}
			});
		}
   }
   return queryServer; 
});
