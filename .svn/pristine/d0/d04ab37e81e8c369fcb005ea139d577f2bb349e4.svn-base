/**
 * 模块加载器
 * 说明：所有模块在此~.~
 */
define(function() {
    var modules = modules || {
        /** 房产估值下模块 *************************************************************/
        // 参考案例
        referenceCase: function() {
            yf.path.load("#referenceCase",{
                controllerUrl: 'src/components/referenceCase/js/referenceCase.controller.js',
                templateUrl: 'src/components/referenceCase/referenceCase.html',
                reload: false // 是否重新加载该组件，默认不重新加载
            });
        },
        // 流动性评级
        liquidityRatingB: function() {
            yf.path.load("#liquidityRatingB",{
                controllerUrl: 'src/components/liquidityRating/js/liquidityRating.controller.js',
                templateUrl: 'src/components/liquidityRating/liquidityRating.html'
            });
        },
        // 小区详情
        communityDetails: function() {
            yf.path.load("#communityDetails",{
                controllerUrl: 'src/components/houseDetail/js/houseDetail.controller.js',
                templateUrl: 'src/components/houseDetail/houseDetail.html'
            });
        },
        // 周边配套
        peripheralMatching: function() {
            yf.path.load("#peripheralMatching",{
                controllerUrl: 'src/components/surroundingFacility/js/surroundingFacility.controller.js',
                templateUrl: 'src/components/surroundingFacility/surroundingFacility.html'
            });
        },
        // 价格走势
        priceTrend: function() {
            yf.path.load("#priceTrend",{
                controllerUrl: 'src/components/priceTrend/js/priceTrend.controller.js',
                templateUrl: 'src/components/priceTrend/priceTrend.html'
            });
        },
        // 临近小区
        neighborhood: function() {
            yf.path.load("#neighborhood",{
                controllerUrl: 'src/components/surroundingHouse/js/surroundingHouse.controller.js',
                templateUrl: 'src/components/surroundingHouse/surroundingHouse.html'
            });
        },
        // 税费计算
        taxCalculation: function() {
             yf.path.load("#taxCalculation",{
                controllerUrl: 'src/components/taxation/js/taxation.controller.js',
                templateUrl: 'src/components/taxation/taxation.html',
                reload: true
            });
        },
        // 估值单
        valuationSheet: function() {
            yf.path.load("#valuationSheet",{
                controllerUrl: 'src/components/valuationSheet/js/valuationSheet.controller.js',
                templateUrl: 'src/components/valuationSheet/valuationSheet.html',
                reload: true
            });
        },
        // 评估报告
        preliminaryReport: function() {
            yf.path.load("#preliminaryReport",{
                controllerUrl: 'src/components/preliminaryReport/js/preliminaryReport.controller.js',
                templateUrl: 'src/components/preliminaryReport/preliminaryReport.html',
                reload: true
            });
        },
        // 人工核价(核价记录)
        artificialNuclearValence: function() {
             yf.path.load("#auditPriceRecord",{
                controllerUrl: 'src/components/artificialNuclearValence/js/artificialNuclearValence.controller.js',
                templateUrl: 'src/components/artificialNuclearValence/artificialNuclearValence.html',
                reload: true
            });
        },
        /** 案例查询下模块 *************************************************************/
    };
    return modules;
});