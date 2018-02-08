define(function(){
	'use strict';
	var moduleExplainServer =  moduleExplainServer ||{
		/*获取列表*/
		getModuleExplain:function(){
			return $.ajax({
				type:"get",
				url:"/api/v1/moduleAuthority/moduleExplain/"+encodeURIComponent(yf.userInfo.city)
			});
		}
	};
	return moduleExplainServer;
})