define(function() {
    'use strict';
     var caseServer = caseServer||{
     	getTabelList:function(data){
     		return $.ajax({
     			type:"get",
     			url:"/api/v1/referenceCase/caseInfoGet/"+encodeURIComponent(data.city)+"/"+encodeURIComponent(data.comName)+"/"+encodeURIComponent(data.caseType)+"/"+encodeURIComponent(data.timeSpan),
     			data:{
     				pageNo:data.pageNo,
     				pageSize:data.pageSize
     			}
     		});
     	}
     }
     return caseServer;
});
