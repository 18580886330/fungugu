define(function () {
	'use strict';
	var taxaTionServer = taxaTionServer || {
		getTaxation: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/taxCalculation/calculation/" + encodeURIComponent(data.city) + "/" + encodeURIComponent(data.overYears) + "/" + encodeURIComponent(data.houseArea) + "/" + encodeURIComponent(data.houseType) + "/" + encodeURIComponent(data.assessmentValue) + "/" + encodeURIComponent(data.fvId),
				data: {
					originalValue: data.originalValue,
					firstHouse: data.firstHouse
				}
			});
		}
	}
	return taxaTionServer;
})