define(function () {
	'use strict';
	var personalCenterServer = personalCenterServer || {
		/*获取个人信息*/
		getPersonalInfo: function () {
			return $.ajax({
				type: "get",
				dataType: 'json',
				url: "/api/v1/personalCenter/personalData/personalInfoGet",
				data: {
					trendType: '询价',
					cityName: yf.userInfo.city
				}
			});
		},
		/*获取行政区*/
		getDistricts: function (data) {
			return $.ajax({
				type: "get",
				dataType: 'json',
				url: "/api/v1/cityAndDistrict/getDistrictByCityId",
				data: {
					cityId: data.cityId
				}
			});
		},
		/*验证图片验证码*/
		provYzm: function (code) {
			return $.ajax({
				type: "get",
				dataType: 'json',
				url: "/api/v1/imageCodeService/verificationPicCode",
				data: {
					code: code
				}
			});
		},
		/*获取手机验证码*/
		getPhoneCode: function (data) {
			return $.ajax({
				type: "post",
				dataType: 'json',
				url: "/api/v1/sms/sendCode",
				data: {
					phoneNum: data.phoneNum,
					keyCode: data.keyCode
				}
			});
		},
		/*提交个人信息*/
		subUserInfo: function (data) {
			return $.ajax({
				type: "post",
				dataType: 'json',
				url: "/api/v1/personalCenter/personalData/personalInfoModify",
				data: data
			});
		},
		/*修改旧密码*/
		updatePwd: function (data) {
			return $.ajax({
				type: "post",
				dataType: 'json',
				url: "/api/v1/personalCenter/personalData/userPasswdModify",
				data: {
					passwdOld: data.passwdOld,
					passwdNew: data.passwdNew,
					cityName: yf.userInfo.city
				}
			});
		},
		/*获取机构共享条数*/
		getValuationSharing: function (data) {
			return $.ajax({
				type: "get",
				dataType: 'json',
				url: "/api/v1/jurisdictionManagement/valuationSharingGet",
				data: data
			});
		}
	};
	return personalCenterServer;
})