define(function() {
    'use strict';
    var surroundingFacilityServer = surroundingFacilityServer||{
    	//小区周边概况
    	getSurvey:function(data){
    		return $.ajax({
    			type:"get",
    			url:"/api/v1/peripheralMatching/infoGet",
    			dataType:'json',
    			data:{
    				cityName:yf.userInfo.city,
    				longitude:data.longitude,
    				latitude:data.latitude
    			}
    		});
    	},
    	//获取小区坐标
    	getComLocation:function(data){
    		return $.ajax({
    			type:"get",
    			url:"/api/v1/communityDetails/coordinateGet",
    			dataType:'json',
    			data:{
    				cityName:yf.userInfo.city,
    				districtName:data.districtName,
    				comName:data.comName
    			}
    		});
    	}
    }
    return surroundingFacilityServer;
});