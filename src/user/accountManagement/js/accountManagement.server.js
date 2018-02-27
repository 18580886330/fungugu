define(function () {
	var accountManagementServer = accountManagementServer || {
		/*获取列表项*/
		getAccountList: function (data) {
			return $.ajax({
				type: "get",
				url: "/api/v1/personalCenter/jurisdictionManagement/accountManagement/subUserGet",
				data: {
					'pageNum': data.pageNum,
					'pageSize': data.pageSize,
					'userName': data.userName,
					'fullName': data.fullName,
					'cityName': yf.userInfo.city
				}
			});
		},
		/*添加账号*/
		addAccountUser: function (data) {
			return $.ajax({
				type: "post",
				url: "/api/v1/jurisdictionManagement/accountManagement/subUserAdd",
				data: {
					userName: data.userName,
					userPwd: data.userPwd,
					fullName: data.fullName,
					department: data.department,
					cityName: yf.userInfo.city
				}
			});
		},
		/*修改or删除账户*/
		operateAccount: function (data) {
			return $.ajax({
				type: "post",
				url: "/api/v1/personalCenter/jurisdictionManagement/accountManagement/subUserModify",
				data: {
					userName: data.userName,
					operationType: data.operationType,//修改(modify)or删除(remove)
					userPwd: data.userPwd || '',
					fullName: data.fullName || '',
					department: data.department || '',
					cityName: yf.userInfo.city
				}
			});
		}
	}
	return accountManagementServer;
})