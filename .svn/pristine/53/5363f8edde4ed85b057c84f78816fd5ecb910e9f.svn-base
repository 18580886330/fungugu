define(function() {
    'use strict';
	var houseDetailServer = houseDetailServer || {
		getHouseDetail:function(data){
			return $.ajax({
				type:"get",
				url:"/api/v1/communityDetails/comDetails/"+encodeURIComponent(data.city)+"/"+encodeURIComponent(data.comName),
			});
		}
	}
	return houseDetailServer;
});
