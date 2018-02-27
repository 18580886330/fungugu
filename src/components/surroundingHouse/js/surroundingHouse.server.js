define(function () {
	'use strict';
	var surroundHouseServer = surroundHouseServer || {
		getSurHouse: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/neighborhood/aroundAvgPrice/" + encodeURIComponent(data.city) + "/" + encodeURIComponent(data.comName) + "/" + encodeURIComponent(data.distance)
			});
		}
	}
	return surroundHouseServer;
});
