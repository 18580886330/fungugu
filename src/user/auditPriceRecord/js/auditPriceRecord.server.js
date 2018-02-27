define(function () {
	'use strict';
	var queryServer = queryServer || {
		/*获取列表*/
		getTableList: function (data) {
			return $.ajax({
				type: 'get',
				url: '/api/v1/artificialNuclearValence/' + encodeURIComponent(data.curCity) + '/mqRecordsGet?' + new Date().getTime(),
				dataType: 'json',
				data: data
			});
		}
	}
	return queryServer;
});
