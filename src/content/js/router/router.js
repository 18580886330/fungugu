~ function() {
    var view = $("div[show-view]");
    // 404
    function notFound(){
        view.html("404 Not Found");
    }
    // 房产估值过渡页
    yf.path.map("#/layout").to({
        controllerUrl: 'src/intelligentSearch/houseValuation/js/houseValuation.controller.js',
        templateUrl: 'src/intelligentSearch/layout/layout.html'
    });
    // 房产估值
    yf.path.map("#/houseValuation").to({
        controllerUrl: 'src/intelligentSearch/houseValuation/js/houseValuation.controller.js',
        templateUrl: 'src/intelligentSearch/houseValuation/houseValuation.html'
    });
    // 案例查询
    /* yf.path.map("#/caseQuery").to({
        controllerUrl: 'src/intelligentSearch/caseInquire/js/caseInquire.controller.js',
        templateUrl: 'src/intelligentSearch/caseInquire/caseInquire.html'
    }); */
    // 估值记录
    yf.path.map("#/valuationRecord").to({
        controllerUrl: 'src/user/valuationRecord/js/valuationRecord.controller.js',
        templateUrl: 'src/user/valuationRecord/valuationRecord.html'
    });

	//核价记录
	 yf.path.map("#/auditPriceRecord").to({
        controllerUrl: 'src/user/auditPriceRecord/js/auditPriceRecord.controller.js',
        templateUrl: 'src/user/auditPriceRecord/auditPriceRecord.html'
    });

	// 个人中心
    yf.path.map("#/personalData").to({
        controllerUrl: 'src/user/personalData/js/personalData.controller.js',
        templateUrl: 'src/user/personalData/personalData.html'
    });

    // 人工询价-人工客服
    yf.path.map("#/chatServer").to({
        controllerUrl: 'src/components/chatServer/js/chatServer.controller.js',
        templateUrl: 'src/components/chatServer/chatServer.html'
    });
    
	//账号管理
	yf.path.map("#/accountManagement").to({
        controllerUrl: 'src/user/accountManagement/js/accountManagement.controller.js',
        templateUrl: 'src/user/accountManagement/accountManagement.html'
    });
    
    //权限管理
    yf.path.map("#/jurisdictionManagement").to({
        controllerUrl: 'src/user/jurisdictionManagement/js/jurisdictionManagement.controller.js',
        templateUrl: 'src/user/jurisdictionManagement/jurisdictionManagement.html'
    });
    
    //应用市场
     yf.path.map("#/moduleExplain").to({
        controllerUrl: 'src/moduleAuthority/moduleExplain/js/moduleExplain.controller.js',
        templateUrl: 'src/moduleAuthority/moduleExplain/moduleExplain.html'
    });
    /*
    * 例子：进入页面之前和离开之后要做的事
    * 说明：一般用于权限验证跳转
    *
    yf.path.map("#/c").enter(function(){
        console.log('enter');
        // 权限验证
        if(0){
            window.history.back();
            this.to();
        }else{
            this.to({
                controllerUrl: 'test/c.controller.js',
                templateUrl: 'c.html'
            });
        }
    }).exit(function(){
        console.log('exit');
    }); */

    yf.path.root("#/layout?page=intelligentSearch");   // 默认地址
    yf.path.rescue(notFound); // 地址不存在出现404
    yf.path.listen();         // 监听路由
}();