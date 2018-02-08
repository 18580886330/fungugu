define(function() {
    'use strict';
    return {
        // 最近检索
        getRecords: function() {
            var param = {
                cityName: yf.userInfo.city // 城市
            }
            return $.ajax({
                type: 'get',
                url: '/api/v1/valuation/records/recentSearch?'+new Date().getTime(),
                dataType: 'json',
                data: param
            });
        },
        // 获取小区联动数据
        linkageBuilding: function(data) {
            var param = {
                // comName: data.comName,  // 小区名称(必填)
                buildingName: data.buildingName || '', // 楼栋名称
                buildingCode: data.buildingCode || '', // 楼栋code
                unitName: data.unitName || '', // 单元名称
                unitCode: data.unitCode || '', // 单元code
                houseName: data.houseName || '', // 户名称
                houseCode: data.houseCode || '', // 户code
            }
            return $.ajax({
                type: 'get',
                url: '/api/v1/propertyValuation/linkageBuilding/'+encodeURIComponent(yf.userInfo.city)+'/'+encodeURIComponent(data.comName),
                dataType: 'json',
                data: param
            });
        },
        // 获取户信息
        getHouseInfos: function(data) {
            var param = {
                // comName: data.comName,  // 小区名称(必填)
                buildingName: data.buildingName || '', // 楼栋名称
                buildingCode: data.buildingCode || '', // 楼栋code
                unitName: data.unitName || '', // 单元名称
                unitCode: data.unitCode || '', // 单元code
                houseName: data.houseName || '', // 户名称
                houseCode: data.houseCode || '', // 户code
            }
            return $.ajax({
                type: 'get',
                url: '/api/v1/propertyValuation/houseInfo/'+encodeURIComponent(yf.userInfo.city)+'/'+encodeURIComponent(data.comName),
                dataType: 'json',
                data: param
            });
        },
        // 估一估
        gugu: function(data) {
            var param = {
                /* distName: data.distName,   // 行政区(必填)
                comName: data.comName,     // 小区名称(必填)
                area: data.area,           // 面积 */
                buildingNo: data.buildingNo, // 楼栋号
                unitNo: data.unitNo, // 单元号
                houseNo: data.houseNo, // 户号
                buildingYears: data.buildingYears, // 建成年代
                floor: data.floor, // 所在楼层
                totalFloor: data.totalFloor, // 总楼层
                toward: data.toward, // 朝向
                specialFactors: data.specialFactors, // 特殊因素
                regionName: data.regionName, // 片区
                comAddress: data.comAddress, // 小区地址
                houseType: data.houseType, // 物业类型
                searchType: data.searchType, // 检索方式
                basePrice: data.basePrice, // 基准价
                pointX: data.pointX, // 经度
                pointY: data.pointY, // 纬度
                originalInputItem:data.originalInputItem //用户原始输入项
            }
            return $.ajax({
                type: 'get',
                url: '/api/v1/propertyValuation/'+encodeURIComponent(yf.userInfo.city)+'/'+encodeURIComponent(data.distName)+'/'+Number(data.area)+'/'+encodeURIComponent(data.comName),
                dataType: 'json',
                data: param
            });
        },
        // 特殊因素
        specialFactors: function(data) {
            return $.ajax({
                type: 'get',
                url: '/api/v1/communityDetails/specialfactors/'+encodeURIComponent(yf.userInfo.city)+'/'+encodeURIComponent(data.comName),
                dataType: 'json'
            });
        },
        getValuationDetail:function(data){
			return $.ajax({
				type:"get",
				url:"/api/v1/valuationSheet/valuationDetailedList/"+encodeURIComponent(data.city)+"/"+encodeURIComponent(data.comName)+"/"+encodeURIComponent(data.area)+"/download",
				data:{
					houseType:data.houseType,
					residentialLocated:data.residentialLocated,
					position:data.position,
					floorBuilding:data.floorBuilding,
					houseNumber:data.houseNumber,
					toward:data.toward,
					builtedTime:data.builtedTime,
					floor:data.floor,
					totalFloor:data.totalFloor,
					specialFactors:data.specialFactors
				}
			});
		},
		//参考均价
		getCompetingPrice:function(data){
			return $.ajax({
				type:"get",
				url:"/api/v1/competingPrice/"+encodeURIComponent(yf.userInfo.city)+"/"+encodeURIComponent(data.comName)
			});
		}
    }
});
