define(function(){
	'use strict';
	var priceTrendServer = priceTrendServer||{
		getTrendInfo:function(data){
			return $.ajax({
				type:"get",
				url:"/api/v1/priceTrend/"+encodeURIComponent(data.city)+"/"+encodeURIComponent(data.comName)+"/"+encodeURIComponent(data.timeSpan),
				data:{
					houseType:data.houseType
				}
			});
		}
	}
	return priceTrendServer;
})