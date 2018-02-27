require([
	'src/components/valuationSheet/js/valuationSheet.server.js',
], function (server) {
	var main = ({
		init: function () {
			this.downBillFn();
		},
		downBillFn: function () {
			var params = {
				city: yf.userInfo.city,
				comName: yf.$params().housingName,
				area: yf.$params().houseArea,
				houseType: yf.$params().estateType,
				residentialLocated: yf.$params().buildingName + yf.$params().unitName + yf.$params().houseName,
				position: yf.userInfo.city + yf.$params().istrative + yf.$params().buildingName + yf.$params().unitName + yf.$params().houseName,
				floorBuilding: yf.$params().buildingName,
				houseNumber: yf.$params().unitName,
				toward: yf.$params().toward,
				builtedTime: yf.$params().year,
				floor: yf.$params().floor,
				totalFloor: yf.$params().sumFloor,
				specialFactors: yf.$params().special,
				marketPrice: yf.$params().jUnitPrice,
				marketTotalPrice: yf.$params().jTotalPrice,
				unitNumber: yf.$params().unitName,
				mortgagePrice: yf.$params().mortgagePrice,
				mortgageTotalPrice: yf.$params().mortgageTotalPrice
			};
			var i = layer.load(2, { shade: [0.1, '#000'] });
			server.getValuationDetail(params).success(function (data) {
				if (!yf.msg(data)) {
					layer.close(i);
					return;
				};
				if (data.code == 200) {
					layer.close(i);
					$('#guzhiDownload').attr('href', data.data);
					layer.open({
						type: '1',
						title: false,
						closeBtn: false,
						shadeClose: false,
						resize: false,
						area: ['auto', 'auto'],
						content: $('#guzhiDownPop'),
						success: function () {
							$('#guzhiDownload').off('click').click(function () {
								layer.closeAll();
								layer.msg('下载成功');
							})
						},
						end: function () {
							$('#guzhiDownPop').hide();
						}
					});
				} else {
					layer.msg('下载失败');
					layer.close(i);
				}
			}).error(function (res) {

			})
		}
	}).init();
})
