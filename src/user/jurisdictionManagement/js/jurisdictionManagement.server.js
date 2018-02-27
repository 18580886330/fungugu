define(function () {
	var jurisdictionManagement = jurisdictionManagement || {
		getJurisdictionList: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/jurisdictionManagement/discountRateGet",
				data: {
					userId: data.userId || '',
					selectCity: data.selectCity || '',
					pageNo: data.pageNo,
					pageSize: data.pageSize,
					cityName: yf.userInfo.city
				}
			});
		},
		/*保存*/
		getAmend: function (data) {
			return $.ajax({
				type: "post",
				url: "/api/v1/jurisdictionManagement/discountRateSet",
				data: {
					recordId: data.recordId,
					mortgageRate: data.mortgageRate,
					discountRate: data.discountRate,
					priceTypeDefault: data.priceTypeDefault,//(0:市场评估价;1:抵押评估价;2:自设抵押评估价)
					cityName: yf.userInfo.city
				}
			});
		},
		/*获取机构*/
		getMechanisms: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/jurisdictionManagement/lowerLevelGet",
				data: {
					moduleName: data.moduleName,//（'询价记录关联','估值共享关联'，'抵押比率关联'）
					selectCity: data.selectCity,
					cityName: yf.userInfo.city
				}
			});
		},
		/*获取下级城市列表*/
		getsubordinateCity: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/jurisdictionManagement/lowerLevelCityGet",
				data: {
					moduleName: data.moduleName,//（'询价记录关联','估值共享关联'，'抵押比率关联'）
					subUserId: data.subUserId,
					cityName: yf.userInfo.city
				}
			});
		},
		/*批量设置*/
		getBatchSetUp: function (data) {
			return $.ajax({
				type: "post",
				url: "/api/v1/jurisdictionManagement/discountRateSetBatch",
				data: {
					userId: data.userId,
					selectCity: data.selectCity,
					mortgageRate: data.mortgageRate,
					discountRate: data.discountRate,
					priceTypeDefault: data.priceTypeDefault,//(0:市场评估价;1:抵押评估价;2:自设抵押评估价)
					cityName: yf.userInfo.city
				}
			});
		}
	}
	return jurisdictionManagement;
})