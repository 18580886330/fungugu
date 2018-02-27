require([
	'src/components/priceTrend/js/priceTrend.server.js',
], function (server) {
	'use strict';

	var main = ({
		init: function () {
			var _this = this;
			this.trendInfo();
			yf.priceTrend = {
				main: _this
			};
			this.residenceData = '';//住宅数据
			this.villaData = '';//别墅数据
			return this;
		},
		trendInfo: function () {
			var _this = this;
			var params = {
				city: yf.userInfo.city,
				comName: yf.param('housingName'),
				timeSpan: '6',
				houseType: $('#valuationRequire').find('select[name="estateType"]').eq(0).val()
			};
			$('#residen_name').text(yf.param('housingName'));
			$('#residen_name').attr('title', yf.param('housingName'));
			$('#city_name').text(yf.userInfo.city);
			$('#city_name').attr('title', yf.userInfo.city);
			$('#district_name').text(yf.param('istrative'));
			$('#district_name').attr('title', yf.param('istrative'));
			yf.loading('#priceTrend');

			//缓存数据
			if (params.houseType == '别墅' && this.villaData != '' && this.villaData != undefined) {
				this.solveDataFn(_this.villaData);
				yf.removeLoading("#priceTrend");
				return;
			};
			if (params.houseType == '' || params.houseType == '住宅') {
				if (this.residenceData != undefined && this.residenceData != '') {
					this.solveDataFn(_this.residenceData);
					yf.removeLoading("#priceTrend");
					return;
				}

			}

			server.getTrendInfo(params).success(function (data) {
				if (data.code == 200) {
					var arrDate = [];
					$('.non-detail,#non_trend').addClass('hide');
					$('#analysis_body').show();
					if (data.data.residentialarea == "" || data.data.district == "" || data.data.city == "") {
						//$('#bargainTrend').html('<div class="non-trend">暂无小区价格走势</div>');
						$('#non_trend').removeClass('hide');
						$('#analysis_body').hide();
						$('.non-detail').removeClass('hide').text('暂无价格分析');
						yf.removeLoading("#priceTrend");
						return;
					}
					_this.solveDataFn(data);
					params.houseType == '别墅' ? _this.villaData = data : _this.residenceData = data;
				} else {
					//$('#bargainTrend').html('<div class="non-trend">暂无小区价格走势</div>');
					$('#non_trend').removeClass('hide');
					$('#analysis_body').hide();
					$('.non-detail').removeClass('hide').text('暂无小区价格走势详情');
				}
				yf.removeLoading("#priceTrend");
			}).error(function () {

			})
		},
		//处理日期
		solveDataFn: function (data) {
			var _this = this;
			var arrDate = [];
			for (var i = 0; i < data.data.residentialarea.length; i++) {
				arrDate.push(yf.dateStampFn(data.data.residentialarea[i].priceDate).split('-')[1] + '月');
			}
			this.trendInit(arrDate, data.data.residentialarea, data.data.city, data.data.district, data);
			this.specificFn(data, i - 1);
		},
		/*右边的模块*/
		specificFn: function (data, i) {
			var lastDate = (yf.dateStampFn(data.data.residentialarea[i].priceDate)).split('-')[0] + '年' +
				(yf.dateStampFn(data.data.residentialarea[i].priceDate)).split('-')[1] + '月';
			$('#trend_date').text(lastDate);
			$('#residen_price').text(data.data.residentialarea[i].price);


			this.disPrecFn('#residen_huanbi', data.data.residentialarea[i].trendRatio);
			this.disPrecFn('#city_huanbi', data.data.city[i].trendRatio);
			this.disPrecFn('#district_huanbi', data.data.district[i].trendRatio);
			$('#city_price').text(data.data.city[i].price);
			$('#district_price').text(data.data.district[i].price);
		},
		disPrecFn: function (id, prec) {
			if (prec >= 0) {
				$(id).removeClass('decline').addClass('rise');
				$(id).html('环比上月<strong class="c-red">' + prec.toFixed(2) + '%</strong><b class="icon up"></b>')
			} else {
				$(id).removeClass('rise').addClass('decline');
				$(id).html('环比上月<strong class="c-green">' + prec.toFixed(2) + '%</strong><b class="icon down"></b>')
			}
		},
		extractFn: function (data) {
			var arr = [];
			for (var i = 0; i < data.length; i++) {
				arr.push(data[i].price);
			}
			return arr;
		},
		/*
		 *arrDate:日期
		 *resiData:小区数据
		 *cityData:城市
		 *districtData:行政区 
		 * */
		trendInit: function (arrDate, resiData, cityData, districtData, data) {
			var zsChart = echarts.init(document.getElementById('bargainTrend'));
			var _this = this;
			var option = {
				legend: {
					data: ['小区价格', '行政区价格', '城市价格']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},

				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: arrDate
				},
				yAxis: {
					type: 'value',
					name: '单位：元/㎡'
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: 'rgba(0,0,0,0)',
					formatter: function (params) {
						/* var res =params[0].name;*/
						var res = '';
						/*for (var i = 0, l = params.length; i < l; i++) {
							res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
						}*/
						var idx = params[0].name;
						var i = arrDate.indexOf(idx);
						_this.specificFn(data, i);
						$('#row_tip').parent().hide();
						return res;
					}
				},
				series: [
					{
						name: '小区价格',
						type: 'line',
						data: _this.extractFn(resiData)
					},
					{
						name: '行政区价格',
						type: 'line',
						data: _this.extractFn(districtData)
					},
					{
						name: '城市价格',
						type: 'line',
						data: _this.extractFn(cityData)
					}
				]
			};

			zsChart.setOption(option);
			$(window).resize(function () {
				zsChart.resize();
			});
		}
	}).init();

});
