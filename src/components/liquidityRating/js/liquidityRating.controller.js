require([
	'src/components/liquidityRating/js/liquidityRating.server.js',
], function (rateServer) {
	'use strict';
	//暂缓上线
	; ({
		init: function () {
			//this.getRateDateFn();
		},
		/*获取*/
		getRateDateFn: function () {
			var params = {
				city: yf.param('city'),
				distName: yf.param('distName'),
				comName: yf.param('comName'),
			}
			rateServer.getRateFn(params).success(function (data) {
				if (data.code == 200) {
					console.log(data)
				}
			}).error(function (res) { })
		}
	}).init();
});
