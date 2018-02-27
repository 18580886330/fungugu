define(function () {
	'use strict';
	var feedBackServe = feedBackServe || {
		sendFeed: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/feedBack/version",
				data: data
			});
		}
	}
	return feedBackServe;
})