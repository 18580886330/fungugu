define(function () {
	var cityServer = cityServer || {
		getCity: function () {
			return $.ajax({
				type: 'get',
				url: "/api/v1/authorityCityInfo",
				dataType: 'json'
			});
		}
	};
	return cityServer;
});
