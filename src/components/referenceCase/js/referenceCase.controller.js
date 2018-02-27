require([
	'src/components/referenceCase/js/referenceCase.server.js',
], function (server) {
	'use strict';

	var main = ({
		init: function () {
			var _this = this;
			yf.referenceCase = {
				main: _this
			}; // 存储参考案例数据，用于export
			this.legendArr = [];
			this.seriesArr = [];
			this.chartGuapai = [];
			this.chartChengjiao = [];
			this.getCaseData('挂牌', 1, '#guapai_list', 150, 'casePage');
			this.getCaseData('成交', '1', '#deal_list', 150, 'donePage');
			return this;
		},
		/*获取table数据
		 *type:类型
		 *id:加载数据的容器 
		 *pageSize:每页数量
		 *pageId:分页的容器
		 * */
		getCaseData: function (type, cur, id, pageSize, pageId) {
			var _this = this;
			var param = {
				city: yf.userInfo.city,
				comName: yf.param('housingName'),
				caseType: type,
				timeSpan: '6',
				pageSize: pageSize || 5,
				pageNo: cur || 1
			};
			yf.loading('#changeCaseBd');
			server.getTabelList(param).success(function (data) {
				if (data.code == 200) {
					var str = "";
					var result = data.data.list;
					for (var i = 0; i < result.length; i++) {
						str += _this.concatStrFn(data.data.list[i]);
					};
					if (id != null) $(id).html(str);
					if (pageSize != null) {
						var pages = Math.ceil(data.data.list.length / 5); //得到总页数
						if (type == '挂牌') {
							yf.referenceCase.guapaiData = data.data;
						} else if (type == '成交') {
							yf.referenceCase.successData = data.data;
						}
						_this.initChartsFn(type, data.data);
						_this.disposeDataFn(1, id, type, data, pageId);
						_this.pageFn(pageId, type, data, 'getCaseData', id, pages);
					}
				} else {
					$(id).html('<tr class="text-center"><td colspan="5"><div class="non-row">暂无小区' + type + '案列</div></td></tr>');
					//$('#caseChart').html('<div class="non-draw">无法绘制小区案例散点图</div>');
					_this.initChartsFn(type, data.data);
				}
				setTimeout(function () {
					yf.removeLoading('#changeCaseBd');
				}, 1000)
			}).error(function (e) { })
		},
		/*处理数据
		 *curr:当前页
		 *id:加载数据的盒子
		 *data:数据
		 *
		 */
		disposeDataFn: function (curr, id, type, data) {
			var str = '';
			var nums = 5; //每页出现的数量
			var pages = Math.ceil(data.data.list.length / nums); //得到总页数
			var last = curr * nums - 1;
			last = last >= data.data.list.length ? (data.data.list.length - 1) : last;
			for (var i = (curr * nums - nums); i <= last; i++) {
				str += this.concatStrFn(data.data.list[i]);
			}
			$(id).html(str);

		},
		concatStrFn: function (data) {
			var _this = this;
			return '<tr>\
				<td>'+ yf.dateStampFn(data.caseTime) + '</td>\
				<td>'+ yf.filterStr(data.area) + '</td>\
				<td>'+ yf.filterStr(_this.getHouseTypeFn(data.roomType)) + '</td>\
				<td>'+ yf.filterStr(data.price) + '</td>\
				<td>'+ yf.filterStr(data.totalPrice) + '</td>\
			</tr>';
		},
		/*居室的处理*/
		getHouseTypeFn: function (tm) {
			var tt;
			if (tm == 1) {
				tt = "一居室";
			} else if (tm == 2) {
				tt = "二居室";
			} else if (tm == 3) {
				tt = "三居室";
			} else if (tm == 4) {
				tt = "四居室";
			} else if (tm == 5) {
				tt = "五居室";
			} else if (tm == 0 || tm == 6 || tm == 7 || tm == 8 || tm == 9) {
				tt = "五居室以上";
			}
			return tt;
		},
		/*分页*/
		pageFn: function (id, type, data, callBack, cont, pages) {
			var _this = this;
			layui.use(['laypage'], function () {
				layui.laypage.render({
					elem: id, //注意，这里的 test1 是 ID，不用加 # 号
					curr: data.data.pageNum || 1,
					count: data.data.total,
					layout: ['prev', 'page', 'next', 'count'],
					groups: 3,
					limit: 5,            //每页显示的条数
					jump: function (obj, first) {
						if (!first && obj.curr < pages) {
							_this.disposeDataFn(obj.curr, cont, type, data);
						};
						if (!first && obj.curr >= pages) {
							//self[callBack](type,obj.curr,cont);
							_this.getCaseData(type, obj.curr, cont, null);
						};
					}
				});
			})

		},
		/*散点图
		 *type:类型
		 *data:数据
		 */
		initChartsFn: function (type, data, linePrice) {
			var _this = this;
			if (type == '挂牌') {
				if (data != null && data != '') {
					var guapaiArr = [];
					for (var i = 0; i < data.list.length; i++) {
						guapaiArr.push([Number(data.list[i].caseTime), data.list[i].price]);
					};
					this.chartGuapai = guapaiArr;
				}
			};
			if (type == '成交') {
				if (data != null && data != '') {
					var doneArr = [];
					for (var i = 0; i < data.list.length; i++) {
						doneArr.push([Number(data.list[i].caseTime), data.list[i].price]);
					};
					this.chartChengjiao = doneArr;
				}
			};
			this.showChartsFn(this.chartGuapai, this.chartChengjiao, linePrice);
		},
		showChartsFn: function (guaArr, chengjiaoArr, linePrice) {
			if (chengjiaoArr.length == 0 && guaArr.length == 0) {
				$('#no_scatter').removeClass('hide');
				$('#caseChart').hide();
				//$('#caseChart').html('<div class="non-draw">无法绘制小区案例散点图</div>');
				return;
			};
			$('#caseChart').show();
			$('#no_scatter').addClass('hide');
			var caseChart = echarts.init(document.getElementById('caseChart'));
			var _this = this;
			var option = {
				color: ['#93BAEC', '#ED9C97'],
				legend: {
					y: 'top',
					data: ['挂牌', '成交']

				},
				grid: {
					left: '1%',
					right: '12%',
					bottom: '3%',
					containLabel: true
				},
				tooltip: {
					trigger: 'item',
					formatter: function (params) {
						var s = params.seriesName + '<br/>' + params.marker + yf.dateStampFn(params.data[0]) + " " + params.data[1];
						if (params.componentType == "markLine") {
							s = '估值结果 : ' + linePrice + '元/㎡';
						}
						return s;
					}
				},
				xAxis: {
					type: 'time',
					splitLine: {
						show: false
					},
					splitNumber: 6
				},
				yAxis: {
					type: 'value',
					name: '单位：元/㎡',
					splitLine: {
						show: true
					}
				},

				series: [{
					name: '挂牌',
					type: 'scatter',
					data: guaArr,
					symbolSize: 8
				}, {
					name: '成交',
					type: 'scatter',
					data: chengjiaoArr,
					symbolSize: 8
				}]

			};
			if (linePrice) {
				option.series[0].markLine = {
					data: [
						{
							silent: true,
							yAxis: linePrice
						}
					],
					label: {
						normal: {
							show: 'true',
							color: '#f00',
							fontSize: '12',
							formatter: [
								'{a|估值结果}',
								linePrice,
								'元/㎡'
							].join('\n'),
							rich: {
								a: {
									color: '#000',
									lineHeight: 20,
									fontSize: '12'
								}
							}

						}
					},
					lineStyle: {
						normal: {
							color: 'rgb(128, 128, 128)',
							width: '2'
						}
					}
				}
			};
			caseChart.setOption(option);
			$(window).resize(function () {
				caseChart.resize();
			});
		}
	}).init();

	yf.tab({
		tabId: '#changeCaseHd',
		contents: '#changeCaseBd',
		callBack: function () {
			if (this.index == 1) {
				$('#donePage').show();
				$('#casePage').hide();
				if ($('#changeCaseHd li').eq(1).attr('data-load') == 'false') {
					//main.getCaseData('成交','1','#deal_list',null,'donePage');
					//$('#changeCaseHd li').eq(1).attr('data-load','true');
				}

			} else {
				$('#casePage').show();
				$('#donePage').hide();
			}

		}
	});

});
